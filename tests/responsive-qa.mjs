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

const artifactDir = path.resolve('test-artifacts');
await fs.mkdir(artifactDir,{recursive:true});

const browser = await chromium.launch({headless:true});
const results = [];
let failures = 0;

function safeName(value){ return value.replace(/[^a-z0-9_-]+/gi,'-'); }

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
      const minTap = targets.length ? Math.min(...targets.map(el => {
        const r = el.getBoundingClientRect();
        return Math.min(r.width,r.height);
      })) : 0;
      const bounds = main.getBoundingClientRect();
      const candidates = route ? [...route.querySelectorAll('a,button,img:not([alt=""]),.player-display,.sheet-label,.show-stamp,h2,h3,article,figure')].filter(visible).filter(functional) : [];
      const clippedElements = candidates.filter(el => {
        const r = el.getBoundingClientRect();
        return r.left < bounds.left - 2 || r.right > bounds.right + 2;
      });
      const radio = document.querySelector('.boombox-art');
      const radioSrc = radio?.getAttribute('src') || '';
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
        overflowX:main.scrollWidth > main.clientWidth + 2,
        scrollY:main.scrollHeight > main.clientHeight + 2,
        minTap:Math.round(minTap),
        clipped:clippedElements.length,
        clippedTags:clippedElements.map(el=>`${el.tagName.toLowerCase()}${el.id?'#'+el.id:''}${el.className && typeof el.className==='string'?'.'+el.className.trim().replace(/\s+/g,'.'):''}`),
        radioIndependent:radioSrc.includes('boombox-real-v4.webp') && radio.complete && radio.naturalWidth > 0,
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
    if(route === 'home' && geometry.homeMustFit && measured.scrollY) issues.push('home-scroll-y');
    if(route === 'fotos' && measured.scrollY) issues.push('photos-scroll-y');
    if(route === 'shows' && measured.showCols >= 2 && measured.scrollY) issues.push(`shows-scroll-y-${measured.showCols}cols`);

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
