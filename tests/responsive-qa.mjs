import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173/index.html';
const routes = ['home','historia','contato','integrantes','fotos','shows'];
const geometries = [
  {name:'narrow-tall', width:300, height:960, homeMustFit:true, hasTouch:true},
  {name:'phone-portrait', width:390, height:844, homeMustFit:true, hasTouch:true},
  {name:'wide-short', width:640, height:360, homeMustFit:true, hasTouch:true},
  {name:'square', width:800, height:800, homeMustFit:true, hasTouch:true},
  {name:'tablet-portrait', width:768, height:1024, homeMustFit:true, hasTouch:true},
  {name:'real-custom-tab', width:1280, height:664, homeMustFit:true, hasTouch:true},
  {name:'laptop', width:1366, height:768, homeMustFit:true, hasTouch:false},
  {name:'tv-full-hd', width:1920, height:1080, homeMustFit:true, hasTouch:false},
  {name:'ultrawide', width:2560, height:1080, homeMustFit:true, hasTouch:false}
];

// Intrinsic positions inside the approved 672×464 boombox. These values belong
// to the object, never to a viewport. The test intentionally fails if a media
// query or legacy responsive rule moves an internal part independently.
// Final static player: display + five physical keys are intrinsic to the
// radio and must stay at these normalized positions at every viewport size.
const radioCoordinates = {
  stop:{left:.4235,top:.8215,width:.0565,height:.094},
  prev:{left:.4845,top:.8215,width:.0565,height:.094},
  play:{left:.5445,top:.8215,width:.0565,height:.094},
  next:{left:.6055,top:.8215,width:.0565,height:.094},
  pause:{left:.6665,top:.8215,width:.0565,height:.094}
};
const displayPolygon = '183,136 548,120 548,159 183,178';
const coordinateTolerance = .008;

const artifactDir = path.resolve('test-artifacts');
await fs.mkdir(artifactDir,{recursive:true});

const browser = await chromium.launch({headless:true});
const results = [];
let failures = 0;

function safeName(value){ return value.replace(/[^a-z0-9_-]+/gi,'-'); }
function coordinateIssues(actual){
  const issues=[];
  for(const [part,expected] of Object.entries(radioCoordinates)){
    const got=actual?.[part];
    if(!got){ issues.push(`radio-coordinate-missing:${part}`); continue; }
    for(const [axis,value] of Object.entries(expected)){
      if(!Number.isFinite(got[axis]) || Math.abs(got[axis]-value)>coordinateTolerance){
        issues.push(`radio-coordinate-${part}-${axis}:${got[axis] ?? 'nan'}`);
      }
    }
  }
  return issues;
}

for (const geometry of geometries){
  const context = await browser.newContext({
    viewport:{width:geometry.width,height:geometry.height},
    hasTouch:geometry.hasTouch,
    deviceScaleFactor:1
  });
  const page = await context.newPage();

  for (const route of routes){
    const url = `${baseURL}?matrix=1#${route}`;
    await page.goto(url,{waitUntil:'networkidle'});
    await page.waitForSelector('[data-route].is-active');
    await page.waitForTimeout(120);

    const measured = await page.evaluate(() => {
      const main = document.querySelector('main');
      const route = document.querySelector('[data-route].is-active');
      const visible = el => {
        if(!el) return false;
        const s = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) !== 0 && r.width > 1 && r.height > 1;
      };
      const functional = el => !el.closest('[aria-hidden="true"]');
      const targets = [
        ...document.querySelectorAll('.site-nav a'),
        ...(route ? route.querySelectorAll('a,button') : [])
      ].filter(visible).filter(functional);

      // Normal UI keeps the 44px rule. The radio's transparent hotspots are
      // measured separately because they deliberately match physical keys in
      // the artwork rather than drawing larger fake controls around them.
      const standardTargets = targets.filter(el=>!el.classList.contains('boombox-hotspot'));
      const minTap = standardTargets.length ? Math.min(...standardTargets.map(el => {
        const r = el.getBoundingClientRect();
        return Math.min(r.width,r.height);
      })) : 0;

      const radioHotspots = targets.filter(el=>el.classList.contains('boombox-hotspot'));
      const hotspotBoxes = radioHotspots.map(el=>{
        const r=el.getBoundingClientRect();
        return {id:el.id,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height};
      });
      const radioBox = document.querySelector('.boombox-art')?.getBoundingClientRect();
      const hotspotsInside = radioBox ? hotspotBoxes.every(r=>r.left>=radioBox.left-2 && r.right<=radioBox.right+2 && r.top>=radioBox.top-2 && r.bottom<=radioBox.bottom+2) : false;
      const hotspotOverlap = hotspotBoxes.flatMap((a,i)=>hotspotBoxes.slice(i+1).filter(b=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1).map(b=>`${a.id}:${b.id}`));

      const machine = document.querySelector('.music-machine');
      const machineRect = machine?.getBoundingClientRect();
      const normalizedStyle = (selector, relativeTo = machineRect) => {
        const el=document.querySelector(selector);
        if(!el || !relativeTo?.width || !relativeTo?.height) return null;
        const s=getComputedStyle(el);
        const value=(name,base)=>parseFloat(s[name])/base;
        return {
          left:value('left',relativeTo.width),
          top:value('top',relativeTo.height),
          width:value('width',relativeTo.width),
          height:value('height',relativeTo.height)
        };
      };
      const radioCoordinates = machineRect ? {
        stop:normalizedStyle('#stop-track'),
        prev:normalizedStyle('#prev-track'),
        play:normalizedStyle('#play-track'),
        next:normalizedStyle('#next-track'),
        pause:normalizedStyle('#pause-track')
      } : null;

      const bounds = {left:0,right:document.documentElement.clientWidth};
      const candidates = route ? [...route.querySelectorAll('a,button,img:not([alt=""]),.sheet-label,.show-stamp,h2,h3,article,figure')].filter(visible).filter(functional) : [];
      const viewportRect = el => {
        const clipAncestor = el.closest('.member-photo,.photo-card,.history-rehearsal');
        if (clipAncestor && clipAncestor !== el && getComputedStyle(clipAncestor).overflow === 'hidden') {
          return clipAncestor.getBoundingClientRect();
        }
        return el.getBoundingClientRect();
      };
      const clippedElements = candidates.filter(el => {
        const r = viewportRect(el);
        return r.left < bounds.left - 2 || r.right > bounds.right + 2;
      });
      const radio = document.querySelector('.boombox-art');
      const radioSrc = radio?.getAttribute('src') || '';
      const screenPolygon = document.querySelector('.boombox-display-glass')?.getAttribute('points')?.trim() || '';
      const screenOverlay = document.querySelector('.boombox-display-overlay');
      const active = route?.dataset.route || 'unknown';
      const showLayout = document.querySelector('.show-layout');
      const showTemplate = showLayout && visible(showLayout) ? getComputedStyle(showLayout).gridTemplateColumns : '';
      const showCols = showTemplate && showTemplate !== 'none' ? showTemplate.trim().split(/\s+/).filter(Boolean).length : 0;
      return {
        active,
        mainWidth:Math.round(main.clientWidth),
        mainHeight:Math.round(main.clientHeight),
        mainScrollWidth:Math.round(main.scrollWidth),
        mainScrollHeight:Math.round(main.scrollHeight),
        overflowX:document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        scrollY:main.scrollHeight > main.clientHeight + 2,
        minTap:Math.round(minTap),
        radioHotspots:hotspotBoxes.length,
        hotspotsInside,
        hotspotOverlap,
        radioCoordinates,
        screenPolygon,
        screenOverlayReady:!!screenOverlay && screenOverlay.getAttribute('viewBox')==='0 0 672 464',
        clipped:clippedElements.length,
        clippedTags:clippedElements.map(el=>`${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}${el.className && typeof el.className==='string'?'.'+el.className.trim().replace(/\s+/g,'.'):''}`),
        radioIndependent:radioSrc.includes('canon/boombox-final-static.webp') && radio.complete && radio.naturalWidth === 672 && radio.naturalHeight === 464,
        showCols,
        meter:document.querySelector('#qa-meter')?.textContent || ''
      };
    });

    const issues = [];
    if(measured.active !== route) issues.push(`rota=${measured.active}`);
    if(measured.overflowX) issues.push('overflow-x');
    if(measured.minTap > 0 && measured.minTap < 44) issues.push(`tap-${measured.minTap}`);
    if(measured.clipped > 0) issues.push(`clip-x-${measured.clipped}`);
    if(route === 'home' && !measured.radioIndependent) issues.push('radio-scene');
    if(route === 'home' && measured.radioHotspots !== 5) issues.push(`radio-hotspots-${measured.radioHotspots}`);
    if(route === 'home' && !measured.hotspotsInside) issues.push('radio-hotspots-outside');
    if(route === 'home' && measured.hotspotOverlap.length) issues.push(`radio-hotspots-overlap:${measured.hotspotOverlap.join(',')}`);
    if(route === 'home') issues.push(...coordinateIssues(measured.radioCoordinates));
    if(route === 'home' && measured.screenPolygon !== displayPolygon) issues.push('radio-display-polygon');
    if(route === 'home' && !measured.screenOverlayReady) issues.push('radio-display-viewbox');

    const pass = issues.length === 0;
    const row = {geometry:geometry.name,width:geometry.width,height:geometry.height,route,pass,issues,...measured};
    results.push(row);

    if(!pass){
      failures++;
      const shot = path.join(artifactDir,`${safeName(geometry.name)}-${safeName(route)}.png`);
      await page.screenshot({path:shot,fullPage:true});
      console.error(`FAIL ${geometry.width}x${geometry.height} ${route}: ${issues.join(', ')}${measured.clippedTags.length?' · '+measured.clippedTags.join(', '):''}`);
    } else {
      console.log(`PASS ${geometry.width}x${geometry.height} ${route} · tap>=${measured.minTap} · scrollY=${measured.scrollY?'sim':'não'}${route==='shows'?` · showCols=${measured.showCols}`:''}`);
    }
  }
  await context.close();
}

await browser.close();
await fs.writeFile(path.join(artifactDir,'results.json'),JSON.stringify({failures,results},null,2));

const summary = [
  '# TASG V3 Responsive QA',
  '',
  `- Geometrias: ${geometries.length}`,
  `- Rotas por geometria: ${routes.length}`,
  `- Casos executados: ${results.length}`,
  `- Falhas: ${failures}`,
  '',
  ...results.filter(r=>!r.pass).map(r=>`- FAIL ${r.width}×${r.height} ${r.route}: ${r.issues.join(', ')}${r.clippedTags.length?' · '+r.clippedTags.join(', '):''}`)
].join('\n');
await fs.writeFile(path.join(artifactDir,'summary.md'),summary);
console.log(`\n${summary}`);

if(failures > 0) process.exit(1);
