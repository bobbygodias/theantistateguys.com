import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL=process.env.QA_BASE_URL || 'http://127.0.0.1:4173/qa-site-v3.html';
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
    if(u.hostname==='127.0.0.1') return u.pathname.replace(/^\//,'') || 'qa-site-v3.html';
    return u.origin+u.pathname;
  }catch{return url;}
}
function totalBytes(entries){
  return entries.reduce((sum,e)=>sum+(e.encodedBodySize||e.transferSize||0),0);
}
function kb(bytes){return Math.round(bytes/1024*10)/10;}

for(const geometry of geometries){
  const context=await browser.newContext({
    viewport:{width:geometry.width,height:geometry.height},
    hasTouch:geometry.touch,
    deviceScaleFactor:1
  });
  const page=await context.newPage();
  await page.goto(`${baseURL}?perf=1#home`,{waitUntil:'networkidle'});
  await page.waitForSelector('[data-route="home"].is-active');
  await page.waitForTimeout(200);

  const readEntries=()=>page.evaluate(()=>performance.getEntriesByType('resource').map(e=>({
    name:e.name,
    initiatorType:e.initiatorType,
    transferSize:e.transferSize||0,
    encodedBodySize:e.encodedBodySize||0,
    decodedBodySize:e.decodedBodySize||0,
    duration:Math.round(e.duration*10)/10
  })));

  const initial=await readEntries();
  const initialLocal=initial.filter(e=>e.name.includes('127.0.0.1:4173'));
  const initialExternal=initial.filter(e=>!e.name.includes('127.0.0.1:4173'));
  const row={
    geometry:geometry.name,
    width:geometry.width,
    height:geometry.height,
    initial:{
      localCount:initialLocal.length,
      localBytes:totalBytes(initialLocal),
      externalCount:initialExternal.length,
      externalBytes:totalBytes(initialExternal),
      resources:initialLocal.map(e=>({...e,path:localPath(e.name)})).sort((a,b)=>(b.encodedBodySize||b.transferSize)-(a.encodedBodySize||a.transferSize))
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
  lines.push(`- Home inicial local: ${row.initial.localCount} recursos · ${kb(row.initial.localBytes)} KB`);
  lines.push(`- Home inicial externo: ${row.initial.externalCount} recursos · ${kb(row.initial.externalBytes)} KB`);
  lines.push('- Maiores recursos locais iniciais:');
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
