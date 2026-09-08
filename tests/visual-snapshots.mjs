import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL=process.env.QA_BASE_URL || 'http://127.0.0.1:4173/index.html';
const out=path.resolve('test-artifacts','visual');
await fs.mkdir(out,{recursive:true});

const samples=[
  {name:'narrow-tall-home',width:300,height:960,route:'home',touch:true},
  {name:'narrow-tall-members',width:300,height:960,route:'integrantes',touch:true},
  {name:'narrow-tall-photos',width:300,height:960,route:'fotos',touch:true},
  {name:'wide-short-home',width:640,height:360,route:'home',touch:true},
  {name:'wide-short-shows',width:640,height:360,route:'shows',touch:true},
  {name:'square-shows',width:800,height:800,route:'shows',touch:true},
  {name:'real-home',width:1280,height:664,route:'home',touch:true},
  {name:'real-history',width:1280,height:664,route:'historia',touch:true},
  {name:'real-members',width:1280,height:664,route:'integrantes',touch:true},
  {name:'real-photos',width:1280,height:664,route:'fotos',touch:true},
  {name:'real-shows',width:1280,height:664,route:'shows',touch:true},
  {name:'tv-home',width:1920,height:1080,route:'home',touch:false},
  {name:'tv-members',width:1920,height:1080,route:'integrantes',touch:false},
  {name:'tv-photos',width:1920,height:1080,route:'fotos',touch:false}
];

const browser=await chromium.launch({headless:true});
const manifest=[];
for(const sample of samples){
  const context=await browser.newContext({
    viewport:{width:sample.width,height:sample.height},
    hasTouch:sample.touch,
    deviceScaleFactor:1
  });
  const page=await context.newPage();
  await page.goto(`${baseURL}?visual=1#${sample.route}`,{waitUntil:'networkidle'});
  await page.waitForSelector(`[data-route="${sample.route}"].is-active`);
  await page.evaluate(()=>document.fonts?.ready);
  await page.waitForTimeout(180);
  const file=`${sample.name}.png`;
  await page.screenshot({path:path.join(out,file),fullPage:false});
  const state=await page.evaluate(()=>({
    meter:document.querySelector('#qa-meter')?.textContent||'',
    scrollTop:document.querySelector('main')?.scrollTop||0,
    scrollHeight:document.querySelector('main')?.scrollHeight||0,
    clientHeight:document.querySelector('main')?.clientHeight||0
  }));
  manifest.push({...sample,file,...state});
  console.log(`SNAP ${sample.width}x${sample.height} ${sample.route} -> ${file}`);
  await context.close();
}
await browser.close();
await fs.writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
console.log(`Captured ${manifest.length} representative visual samples.`);
