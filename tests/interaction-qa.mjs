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
  await page.waitForFunction(()=>document.querySelector('.music-machine')?.classList.contains('boombox-native-controls'));

  const issues=[];

  // Estado inicial: Home ativa, catálogo carregado, mas transporte físico desligado até inserir o CD.
  assert(await page.locator('.site-nav [data-route-link="home"]').getAttribute('aria-current')==='page','home-sem-aria-current',issues);
  assert(await page.locator('#play-pause').getAttribute('aria-pressed')==='false','play-sem-aria-pressed-false',issues);
  assert(await page.locator('#play-pause').isDisabled(),'play-inicial-deveria-estar-desligado',issues);
  assert((await page.locator('#track-title').textContent()||'').trim().length>0,'titulo-faixa-vazio',issues);
  assert(await page.locator('.music-machine').getAttribute('data-cd-state')==='open','cd-inicial-nao-aberto',issues);

  // Os antigos controles artificiais não podem reaparecer visualmente.
  for(const legacyId of ['open-library','eject-cd']){
    const legacy=page.locator(`#${legacyId}`);
    assert(await legacy.isHidden(),`${legacyId}-ainda-visivel`,issues);
    assert(await legacy.isDisabled(),`${legacyId}-ainda-ativo`,issues);
    assert(await legacy.getAttribute('aria-hidden')==='true',`${legacyId}-sem-aria-hidden`,issues);
  }

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

  // Fluxo físico: tocar no disco fecha a gaveta e só então acorda os quatro hotspots nativos.
  await page.locator('#insert-cd').click();
  assert(await page.locator('.music-machine').getAttribute('data-cd-state')==='closing','cd-nao-entrou-em-closing',issues);
  await page.waitForFunction(()=>document.querySelector('.music-machine')?.dataset.cdState==='ready',{timeout:15000});
  for(const id of ['stop-track','prev-track','play-pause','next-track']){
    assert(!(await page.locator(`#${id}`).isDisabled()),`${id}-nao-ativou-apos-cd`,issues);
  }

  // Os controles devem pertencer geometricamente à própria boombox, ser invisíveis
  // e não se sobrepor. Em toque, o mínimo é 24 CSS px; o restante do site continua 44px.
  const nativeGeometry=await page.evaluate(()=>{
    const machine=document.querySelector('.music-machine');
    const mr=machine.getBoundingClientRect();
    const ids=['prev-track','stop-track','play-pause','next-track'];
    const rows=ids.map(id=>{
      const el=document.getElementById(id);
      const r=el.getBoundingClientRect();
      const style=getComputedStyle(el);
      return {
        id,
        left:r.left,top:r.top,right:r.right,bottom:r.bottom,width:r.width,height:r.height,
        inside:r.left>=mr.left-1 && r.right<=mr.right+1 && r.top>=mr.top-1 && r.bottom<=mr.bottom+1,
        background:style.backgroundColor,
        boxShadow:style.boxShadow
      };
    });
    const overlaps=rows.flatMap((a,i)=>rows.slice(i+1).filter(b=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1 && Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1).map(b=>a.id+':'+b.id));
    const transparent=rows.every(row=>row.background==='rgba(0, 0, 0, 0)' || row.background==='transparent');
    const noShadow=rows.every(row=>row.boxShadow==='none');
    return {
      overlaps,
      inside:rows.every(row=>row.inside),
      transparent,
      noShadow,
      minTarget:Math.min(...rows.map(row=>Math.min(row.width,row.height))),
      debug:machine.classList.contains('debug-hotspots')
    };
  });
  assert(nativeGeometry.overlaps.length===0,'hotspots-sobrepostos:'+nativeGeometry.overlaps.join(','),issues);
  assert(nativeGeometry.inside,'hotspot-fora-da-boombox',issues);
  assert(nativeGeometry.transparent && nativeGeometry.noShadow,'hotspot-desenhando-ui-artificial',issues);
  assert(nativeGeometry.minTarget>=23.5,`hotspot-pequeno-${nativeGeometry.minTarget.toFixed(1)}`,issues);
  assert(!nativeGeometry.debug,'debug-hotspots-em-producao',issues);

  // Transporte real: play/stop e troca de faixa continuam usando o motor existente.
  const initialTitle=(await page.locator('#track-title').textContent()||'').trim();
  await page.locator('#next-track').click();
  await page.waitForTimeout(50);
  const nextTitle=(await page.locator('#track-title').textContent()||'').trim();
  assert(nextTitle!==initialTitle,'next-nao-trocou-faixa',issues);
  await page.locator('#prev-track').click();
  await page.waitForTimeout(50);
  assert((await page.locator('#track-title').textContent()||'').trim()===initialTitle,'prev-nao-retornou-faixa',issues);

  await page.locator('#play-pause').click();
  await page.waitForTimeout(150);
  const playing=await page.locator('#audio').evaluate(a=>!a.paused);
  assert(playing,'play-nao-iniciou-audio',issues);
  await page.locator('#stop-track').click();
  const stopped=await page.locator('#audio').evaluate(a=>({paused:a.paused,currentTime:a.currentTime}));
  assert(stopped.paused && stopped.currentTime===0,'stop-nao-parou-e-zerou',issues);

  // Depois de inserido, o CD permanece fechado; não existe EJECT visual ou fluxo paralelo.
  assert(await page.locator('.music-machine').getAttribute('data-cd-state')==='ready','cd-saiu-do-ready-sem-eject',issues);
  assert(await page.locator('#eject-cd').isHidden(),'eject-reapareceu',issues);
  assert(await page.locator('#open-library').isHidden(),'biblioteca-reapareceu',issues);

  // Nenhum erro JS não tratado no fluxo.
  if(pageErrors.length) issues.push(`pageerror:${pageErrors.join('|')}`);

  const pass=issues.length===0;
  if(!pass){
    failures++;
    await page.screenshot({path:path.join(artifactDir,`interaction-${geometry.name}.png`),fullPage:true});
    console.error(`FAIL interaction ${geometry.width}x${geometry.height}: ${issues.join(', ')}`);
  }else{
    console.log(`PASS interaction ${geometry.width}x${geometry.height} · native-hotspot>=${nativeGeometry.minTarget.toFixed(1)}`);
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
