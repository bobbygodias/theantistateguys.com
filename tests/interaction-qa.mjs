import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173/index.html';
const cases = [
  {name:'narrow',width:300,height:960,hasTouch:true},
  {name:'landscape',width:640,height:360,hasTouch:true},
  {name:'compact',width:390,height:844,hasTouch:true},
  {name:'real-custom-tab',width:1280,height:664,hasTouch:true}
];
const routes = ['home','historia','contato','integrantes','fotos','shows'];
const artifactDir = path.resolve('test-artifacts');
await fs.mkdir(artifactDir,{recursive:true});

const browser = await chromium.launch({headless:true});
const results=[];
let failures=0;

function assert(condition,message,issues){ if(!condition) issues.push(message); }

async function ensureNavOpen(page){
  const toggle=page.locator('#site-menu-toggle');
  if(!(await toggle.count()) || !(await toggle.isVisible())) return;
  if((await toggle.getAttribute('aria-expanded'))!=='true'){
    await toggle.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.getElementById('site-menu-toggle')?.getAttribute('aria-expanded')==='true');
  }
}

for(const geometry of cases){
  const context=await browser.newContext({
    viewport:{width:geometry.width,height:geometry.height},
    hasTouch:geometry.hasTouch,
    deviceScaleFactor:1
  });
  const page=await context.newPage();
  const pageErrors=[];
  page.on('pageerror',error=>pageErrors.push(error.message));

  await page.goto(`${baseURL}?interaction=1#home`,{waitUntil:'networkidle'});
  await page.waitForSelector('[data-route].is-active');
  await page.waitForFunction(()=>document.querySelectorAll('.track-row').length>=2);
  await page.waitForFunction(()=>document.querySelectorAll('.boombox-hotspot').length===4);

  const issues=[];

  // Estado inicial: Home ativa, catálogo carregado, transporte desligado até inserir o CD.
  assert(await page.locator('.site-nav [data-route-link="home"]').getAttribute('aria-current')==='page','home-sem-aria-current',issues);
  assert(await page.locator('#play-pause').getAttribute('aria-pressed')==='false','play-sem-aria-pressed-false',issues);
  assert(await page.locator('#play-pause').isDisabled(),'play-inicial-deveria-estar-desligado',issues);
  assert((await page.locator('#track-title').textContent()||'').trim().length>0,'titulo-faixa-vazio',issues);
  assert(await page.locator('.music-machine').getAttribute('data-cd-state')==='open','cd-inicial-nao-aberto',issues);
  assert(!(await page.locator('#open-library').isVisible()),'biblioteca-auxiliar-visivel',issues);
  assert(!(await page.locator('#eject-cd').isVisible()),'eject-auxiliar-visivel',issues);

  // Navegação via teclado: no mobile, abre o menu real antes de focar cada placa.
  for(const route of routes.filter(r=>r!=='home')){
    await ensureNavOpen(page);
    const link=page.locator(`.site-nav [data-route-link="${route}"]`);
    await link.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(expected=>document.querySelector('[data-route].is-active')?.dataset.route===expected,route);
    await page.waitForTimeout(40);
    const state=await page.evaluate(expected=>{
      const section=document.querySelector(`[data-route="${expected}"]`);
      const labelled=section?.getAttribute('aria-labelledby');
      const heading=labelled?document.getElementById(labelled):section?.querySelector('h1,h2');
      return {
        active:section?.classList.contains('is-active')||false,
        hidden:section?.hidden??true,
        current:document.querySelector(`[data-route-link="${expected}"]`)?.getAttribute('aria-current'),
        focused:document.activeElement===heading,
        scrollTop:Math.max(window.scrollY,document.querySelector('main')?.scrollTop||0)
      };
    },route);
    assert(state.active && !state.hidden,`${route}-nao-ativo`,issues);
    assert(state.current==='page',`${route}-sem-aria-current`,issues);
    assert(state.focused,`${route}-titulo-sem-foco`,issues);
    assert(state.scrollTop===0,`${route}-scroll-nao-resetado`,issues);
  }

  // Photos stay inline; only native browser zoom is available.
  await ensureNavOpen(page);
  await page.locator('.site-nav [data-route-link="fotos"]').click();
  const photo=page.locator('.photo-card img').first();
  await photo.click();
  assert(await page.locator('dialog[open]').count()===0,'foto-abriu-modal',issues);
  assert(await page.locator('[data-photo],.expand-icon,#photo-dialog').count()===0,'expansao-residual',issues);
  const viewport=await page.locator('meta[name="viewport"]').getAttribute('content');
  assert(!/user-scalable=no|maximum-scale=1/.test(viewport||''),'zoom-nativo-bloqueado',issues);
  const saveBlocked=await photo.evaluate(el=>!el.dispatchEvent(new MouseEvent('contextmenu',{bubbles:true,cancelable:true})));
  assert(saveBlocked,'menu-salvar-nao-bloqueado',issues);

  // Volta à Home pelo mesmo caminho de teclado.
  await ensureNavOpen(page);
  await page.locator('.site-nav [data-route-link="home"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('[data-route].is-active')?.dataset.route==='home');
  await page.waitForTimeout(40);
  const homeFocused=await page.evaluate(()=>document.activeElement===document.getElementById('home-title'));
  assert(homeFocused,'home-titulo-sem-foco-no-retorno',issues);

  // Fluxo físico da boombox: tocar no disco fecha a gaveta e acorda apenas os quatro botões nativos.
  await page.locator('#insert-cd').click();
  assert(await page.locator('.music-machine').getAttribute('data-cd-state')==='closing','cd-nao-entrou-em-closing',issues);
  await page.waitForFunction(()=>document.querySelector('.music-machine')?.dataset.cdState==='ready',{timeout:3000});

  // READY must be physically closed: the old tray and the CD itself disappear,
  // while the perspective-correct closed mechanism becomes visible.
  const closedState=await page.evaluate(()=>{
    const visible=selector=>{
      const el=document.querySelector(selector);
      if(!el) return false;
      const s=getComputedStyle(el);
      const r=el.getBoundingClientRect();
      return s.display!=='none' && s.visibility!=='hidden' && Number(s.opacity)>0.01 && r.width>1 && r.height>1;
    };
    const machine=document.querySelector('.music-machine')?.getBoundingClientRect();
    const display=document.querySelector('.player-display')?.getBoundingClientRect();
    return {
      trayVisible:visible('.cd-tray'),
      discVisible:visible('.cd-disc'),
      closedVisible:visible('.cd-closed-panel'),
      wedgePatchVisible:visible('.cd-closed-wedge-patch'),
      displayInside:!!(machine&&display&&display.left>=machine.left&&display.right<=machine.right&&display.top>=machine.top&&display.bottom<=machine.bottom),
      closedSrc:document.querySelector('.cd-closed-panel')?.getAttribute('src')||'',
      wedgePatchSrc:document.querySelector('.cd-closed-wedge-patch')?.getAttribute('src')||''
    };
  });
  assert(!closedState.trayVisible,'ready-gaveta-ainda-visivel',issues);
  assert(!closedState.discVisible,'ready-cd-ainda-visivel',issues);
  assert(closedState.closedVisible,'ready-mecanismo-fechado-invisivel',issues);
  assert(closedState.closedSrc.includes('boombox-mechanism-closed-v3.webp'),'ready-nao-usa-v3',issues);
  assert(closedState.wedgePatchVisible,'ready-correcao-cunha-invisivel',issues);
  assert(closedState.wedgePatchSrc.includes('boombox-ready-wedge-fix.webp'),'ready-correcao-cunha-ausente',issues);
  assert(closedState.displayInside,'ready-display-fora-da-boombox',issues);

  for(const id of ['stop-track','prev-track','play-pause','next-track']){
    assert(!(await page.locator(`#${id}`).isDisabled()),`${id}-nao-ativou-apos-cd`,issues);
  }

  // Native hotspots must stay entirely inside the radio and never overlap each other.
  const geometryState=await page.evaluate(()=>{
    const radio=document.querySelector('.boombox-art').getBoundingClientRect();
    const ids=['stop-track','prev-track','play-pause','next-track'];
    const boxes=ids.map(id=>({id,r:document.getElementById(id).getBoundingClientRect()}));
    const inside=boxes.every(({r})=>r.left>=radio.left-2&&r.right<=radio.right+2&&r.top>=radio.top-2&&r.bottom<=radio.bottom+2);
    const overlaps=boxes.flatMap((a,i)=>boxes.slice(i+1).filter(b=>Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>1&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>1).map(b=>a.id+':'+b.id));
    return {inside,overlaps};
  });
  assert(geometryState.inside,'hotspots-fora-da-boombox',issues);
  assert(geometryState.overlaps.length===0,'hotspots-sobrepostos:'+geometryState.overlaps.join(','),issues);

  // Stop is the user's way out: it stops audio without reopening/redrawing the CD transport.
  await page.locator('#play-pause').click();
  await page.waitForTimeout(80);
  await page.locator('#stop-track').click();
  assert(await page.locator('#audio').evaluate(a=>a.paused),'stop-nao-pausou-audio',issues);
  assert(await page.locator('#audio').evaluate(a=>a.currentTime)===0,'stop-nao-zerou-audio',issues);
  assert(await page.locator('.music-machine').getAttribute('data-cd-state')==='ready','stop-alterou-estado-do-cd',issues);

  // Previous/next remain reachable through the physical key row.
  const first=(await page.locator('#track-title').textContent()||'').trim();
  await page.locator('#next-track').click();
  await page.waitForTimeout(30);
  const second=(await page.locator('#track-title').textContent()||'').trim();
  assert(second!==first,'next-nao-trocou-faixa',issues);
  await page.locator('#prev-track').click();
  await page.waitForTimeout(30);
  assert((await page.locator('#track-title').textContent()||'').trim()===first,'prev-nao-retornou-faixa',issues);

  if(pageErrors.length) issues.push(`pageerror:${pageErrors.join('|')}`);

  const pass=issues.length===0;
  if(!pass){
    failures++;
    await page.screenshot({path:path.join(artifactDir,`interaction-${geometry.name}.png`),fullPage:true});
    console.error(`FAIL interaction ${geometry.width}x${geometry.height}: ${issues.join(', ')}`);
  }else{
    console.log(`PASS interaction ${geometry.width}x${geometry.height}`);
  }
  results.push({...geometry,pass,issues});
  await context.close();
}

await browser.close();
await fs.writeFile(path.join(artifactDir,'interaction-results.json'),JSON.stringify({failures,results},null,2));
const summary=[
  '# TASG V3 Interaction QA','',
  `- Casos: ${results.length}`,
  `- Falhas: ${failures}`,'',
  ...results.map(r=>`- ${r.pass?'PASS':'FAIL'} ${r.width}×${r.height}${r.issues.length?': '+r.issues.join(', '):''}`)
].join('\n');
await fs.writeFile(path.join(artifactDir,'interaction-summary.md'),summary);
console.log(`\n${summary}`);
if(failures) process.exit(1);
