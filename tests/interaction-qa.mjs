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

  const issues=[];

  // Estado inicial: Home ativa, catálogo carregado, mas transporte desligado até inserir o CD.
  assert(await page.locator('.site-nav [data-route-link="home"]').getAttribute('aria-current')==='page','home-sem-aria-current',issues);
  assert(await page.locator('#play-pause').getAttribute('aria-pressed')==='false','play-sem-aria-pressed-false',issues);
  assert(await page.locator('#play-pause').isDisabled(),'play-inicial-deveria-estar-desligado',issues);
  assert(await page.locator('#open-library').isDisabled(),'biblioteca-inicial-deveria-estar-desligada',issues);
  assert((await page.locator('#track-title').textContent()||'').trim().length>0,'titulo-faixa-vazio',issues);
  assert(await page.locator('.music-machine').getAttribute('data-cd-state')==='open','cd-inicial-nao-aberto',issues);

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

  // Fluxo físico da boombox: tocar no disco fecha a gaveta e só então acorda os controles.
  await page.locator('#insert-cd').click();
  assert(await page.locator('.music-machine').getAttribute('data-cd-state')==='closing','cd-nao-entrou-em-closing',issues);
  await page.waitForFunction(()=>document.querySelector('.music-machine')?.dataset.cdState==='ready',{timeout:3000});
  assert(!(await page.locator('#play-pause').isDisabled()),'play-nao-ativou-apos-cd',issues);
  assert(!(await page.locator('#open-library').isDisabled()),'biblioteca-nao-ativou-apos-cd',issues);
  assert(!(await page.locator('#eject-cd').isDisabled()),'eject-nao-ativou-apos-cd',issues);

  // Controls must be physically reachable, not merely present in the DOM.
  const overlaps=await page.evaluate(()=>{
    const ids=['stop-track','prev-track','play-pause','next-track','open-library','eject-cd'];
    const boxes=ids.map(id=>({id,r:document.getElementById(id).getBoundingClientRect()}));
    return boxes.flatMap((a,i)=>boxes.slice(i+1).filter(b=>Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>2 && Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>2).map(b=>a.id+':'+b.id));
  });
  assert(overlaps.length===0,'controles-sobrepostos:'+overlaps.join(','),issues);

  // Biblioteca: abrir, conferir conteúdo e fechar por Escape.
  await page.locator('#open-library').click();
  assert(await page.locator('#music-dialog').evaluate(el=>el.open),'dialog-nao-abriu',issues);
  assert(await page.locator('.track-row').count()>=2,'biblioteca-sem-faixas',issues);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(30);
  assert(!(await page.locator('#music-dialog').evaluate(el=>el.open)),'escape-nao-fechou-dialog',issues);

  // Abrir novamente e selecionar a segunda faixa: seleção deve fechar dialog e atualizar UI/aria-current.
  await page.locator('#open-library').click();
  const rows=page.locator('.track-row');
  const secondName=(await rows.nth(1).locator('.track-name').textContent()||'').trim();
  await rows.nth(1).click();
  await page.waitForTimeout(80);
  assert(!(await page.locator('#music-dialog').evaluate(el=>el.open)),'selecao-nao-fechou-dialog',issues);
  const selectedTitle=(await page.locator('#track-title').textContent()||'').trim();
  assert(selectedTitle===secondName,`titulo-selecao-diverge:${selectedTitle}`,issues);
  assert(await rows.nth(1).getAttribute('aria-current')==='true','faixa-atual-sem-aria-current',issues);

  // Botão fechar explícito também deve funcionar.
  await page.locator('#open-library').click();
  await page.locator('#qa-dialog-close').click();
  await page.waitForTimeout(30);
  assert(!(await page.locator('#music-dialog').evaluate(el=>el.open)),'botao-fechar-nao-fechou-dialog',issues);

  // Eject devolve a boombox ao estado aberto e desliga o transporte novamente.
  await page.locator('#eject-cd').click();
  await page.waitForFunction(()=>document.querySelector('.music-machine')?.dataset.cdState==='open',{timeout:2000});
  assert(await page.locator('#play-pause').isDisabled(),'play-nao-desligou-apos-eject',issues);
  assert(await page.locator('#open-library').isDisabled(),'biblioteca-nao-desligou-apos-eject',issues);

  // Nenhum erro JS não tratado no fluxo.
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
