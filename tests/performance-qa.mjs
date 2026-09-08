import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL=process.env.QA_BASE_URL || 'http://127.0.0.1:4173/index.html';
const out=path.resolve('test-artifacts');
await fs.mkdir(out,{recursive:true});

const geometries=[
  {name:'portrait',width:390,height:844,touch:true},
  {name:'real-custom-tab',width:1280,height:664,touch:true}
];
const routes=['historia','integrantes','fotos','shows','contato'];

const browser=await chromium.launch({headless:true});
const report=[];

function localPath(url){
  try{
    const u=new URL(url);
    if(u.hostname==='127.0.0.1') return u.pathname.replace(/^\//,'') || 'index.html';
    return u.origin+u.pathname;
  }catch{return url;}
}
function totalBytes(entries){
  return entries.reduce((sum,e)=>sum+(e.encodedBodySize||e.transferSize||0),0);
}
function kb(bytes){return Math.round(bytes/1024*10)/10;}
function isQaOnly(entry){
  const p=localPath(entry.name);
  return p==='qa-site-v3.js' || (p==='assets/jvc-player.svg' && entry.initiatorType==='fetch');
}

for(const geometry of geometries){
  const context=await browser.newContext({
    viewport:{width:geometry.width,height:geometry.height},
    hasTouch:geometry.touch,
    deviceScaleFactor:1
  });
  const page=await context.newPage();
  await page.addInitScript(()=>{
    window.__tasgPerf={lcp:null,cls:0};
    try{
      new PerformanceObserver(list=>{
        for(const e of list.getEntries()){
          const el=e.element;
          const cls=el?.className && typeof el.className==='string' ? '.'+el.className.trim().replace(/\s+/g,'.') : '';
          window.__tasgPerf.lcp={
            startTime:Math.round(e.startTime*10)/10,
            size:Math.round(e.size||0),
            url:e.url||'',
            element:el ? `${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}${cls}` : ''
          };
        }
      }).observe({type:'largest-contentful-paint',buffered:true});
    }catch{}
    try{
      new PerformanceObserver(list=>{
        for(const e of list.getEntries()) if(!e.hadRecentInput) window.__tasgPerf.cls+=e.value;
      }).observe({type:'layout-shift',buffered:true});
    }catch{}
  });
  await page.goto(`${baseURL}?perf=1#home`,{waitUntil:'networkidle'});
  await page.waitForSelector('[data-route="home"].is-active');
  await page.waitForTimeout(300);

  const readEntries=()=>page.evaluate(()=>performance.getEntriesByType('resource').map(e=>({
    name:e.name,
    initiatorType:e.initiatorType,
    transferSize:e.transferSize||0,
    encodedBodySize:e.encodedBodySize||0,
    decodedBodySize:e.decodedBodySize||0,
    duration:Math.round(e.duration*10)/10
  })));

  const vitals=await page.evaluate(()=>{
    const fcp=performance.getEntriesByName('first-contentful-paint')[0];
    const images=[...document.images].filter(img=>{
      const s=getComputedStyle(img); const r=img.getBoundingClientRect();
      return s.display!=='none' && s.visibility!=='hidden' && Number(s.opacity)!==0 && r.width>1 && r.height>1;
    }).map(img=>{
      const r=img.getBoundingClientRect();
      const renderedW=Math.round(r.width*10)/10;
      const renderedH=Math.round(r.height*10)/10;
      const naturalPixels=(img.naturalWidth||0)*(img.naturalHeight||0);
      const renderedPixels=Math.max(1,renderedW*renderedH);
      return {
        src:img.currentSrc||img.src,
        className:img.className||'',
        naturalWidth:img.naturalWidth||0,
        naturalHeight:img.naturalHeight||0,
        renderedWidth:renderedW,
        renderedHeight:renderedH,
        pixelAreaRatio:Math.round(naturalPixels/renderedPixels*10)/10
      };
    });
    return {
      fcp:fcp?Math.round(fcp.startTime*10)/10:null,
      lcp:window.__tasgPerf?.lcp||null,
      cls:Math.round((window.__tasgPerf?.cls||0)*10000)/10000,
      images
    };
  });
  vitals.images=vitals.images.map(img=>({...img,path:localPath(img.src)}));
  if(vitals.lcp?.url) vitals.lcp.path=localPath(vitals.lcp.url);

  const initial=await readEntries();
  const initialLocal=initial.filter(e=>e.name.includes('127.0.0.1:4173'));
  const initialExternal=initial.filter(e=>!e.name.includes('127.0.0.1:4173'));
  const qaOnly=initialLocal.filter(isQaOnly);
  const productionLike=initialLocal.filter(e=>!isQaOnly(e));
  const row={
    geometry:geometry.name,
    width:geometry.width,
    height:geometry.height,
    vitals,
    initial:{
      localCount:initialLocal.length,
      localBytes:totalBytes(initialLocal),
      productionLikeCount:productionLike.length,
      productionLikeBytes:totalBytes(productionLike),
      qaOnlyCount:qaOnly.length,
      qaOnlyBytes:totalBytes(qaOnly),
      qaOnlyResources:qaOnly.map(e=>({...e,path:localPath(e.name)})),
      externalCount:initialExternal.length,
      externalBytes:totalBytes(initialExternal),
      resources:productionLike.map(e=>({...e,path:localPath(e.name)})).sort((a,b)=>(b.encodedBodySize||b.transferSize)-(a.encodedBodySize||a.transferSize))
    },
    routeDeltas:[]
  };

  let known=new Set(initial.map(e=>e.name));
  for(const route of routes){
    await page.evaluate(route=>{ location.hash=route; },route);
    await page.waitForSelector(`[data-route="${route}"].is-active`);
    await page.waitForTimeout(250);
    const all=await readEntries();
    const fresh=all.filter(e=>!known.has(e.name));
    fresh.forEach(e=>known.add(e.name));
    const local=fresh.filter(e=>e.name.includes('127.0.0.1:4173'));
    const external=fresh.filter(e=>!e.name.includes('127.0.0.1:4173'));
    row.routeDeltas.push({
      route,
      localCount:local.length,
      localBytes:totalBytes(local),
      externalCount:external.length,
      externalBytes:totalBytes(external),
      resources:local.map(e=>({...e,path:localPath(e.name)})).sort((a,b)=>(b.encodedBodySize||b.transferSize)-(a.encodedBodySize||a.transferSize))
    });
  }
  report.push(row);
  await context.close();
}
await browser.close();

await fs.writeFile(path.join(out,'performance-results.json'),JSON.stringify(report,null,2));
const lines=['# TASG V3 Performance Measurement',''];
for(const row of report){
  lines.push(`## ${row.geometry} — ${row.width}×${row.height}`,'');
  lines.push(`- Home local bruta no laboratório: ${row.initial.localCount} recursos · ${kb(row.initial.localBytes)} KB`);
  lines.push(`- Home local production-like: ${row.initial.productionLikeCount} recursos · ${kb(row.initial.productionLikeBytes)} KB`);
  lines.push(`- Overhead exclusivo de QA: ${row.initial.qaOnlyCount} recursos · ${kb(row.initial.qaOnlyBytes)} KB`);
  for(const r of row.initial.qaOnlyResources) lines.push(`  - ${r.path}: ${kb(r.encodedBodySize||r.transferSize)} KB · ${r.initiatorType}`);
  lines.push(`- Sinais de renderização local: FCP ${row.vitals.fcp??'n/a'} ms · LCP ${row.vitals.lcp?.startTime??'n/a'} ms (${row.vitals.lcp?.element||row.vitals.lcp?.path||'n/a'}) · CLS ${row.vitals.cls}`);
  lines.push('- Imagens visíveis na Home (natural → renderizado · razão de área):');
  for(const img of row.vitals.images) lines.push(`  - ${img.path}: ${img.naturalWidth}×${img.naturalHeight} → ${img.renderedWidth}×${img.renderedHeight} · ${img.pixelAreaRatio}×`);
  lines.push(`- Home inicial externo: ${row.initial.externalCount} recursos · ${kb(row.initial.externalBytes)} KB`);
  lines.push('- Maiores recursos locais production-like:');
  for(const r of row.initial.resources.slice(0,10)) lines.push(`  - ${r.path}: ${kb(r.encodedBodySize||r.transferSize)} KB · ${r.initiatorType}`);
  lines.push('- Custo incremental ao visitar rotas:');
  for(const d of row.routeDeltas){
    const names=d.resources.map(r=>`${r.path} (${kb(r.encodedBodySize||r.transferSize)} KB)`).join(', ') || 'nenhum recurso local novo';
    lines.push(`  - ${d.route}: ${kb(d.localBytes)} KB locais · ${names}`);
  }
  lines.push('');
}
await fs.writeFile(path.join(out,'performance-summary.md'),lines.join('\n'));
console.log(lines.join('\n'));
