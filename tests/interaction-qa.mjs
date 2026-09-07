import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const baseURL = process.env.QA_BASE_URL || 'http://127.0.0.1:4173/qa-site-v3.html';
const cases = [
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
  await page.waitForSelector('#qa-meter');
  await page.waitForFunction(()=>document.querySelectorAll('.track-row').length>=2);

  const issues=[];

  // Estado inicial da rota e player.
  assert(await page.locator('[data-route-link="home"]').getAttribute('aria-current')==='page','home-sem-aria-current',issues);
  assert(await page.locator('#play-pause').getAttribute('aria-pressed')==='false','play-sem-aria-pressed-false',issues);
  assert((await page.locator('#track-title').textContent()||'').trim().length>0,'titulo-faixa-vazio',issues);

  // Navegação via teclado: Enter na placa deve trocar rota e focar o título da seção.
  for(const route of routes.filter(r=>r!=='home')){
    const link=page.locator(`[data-route-link="${route}"]`);
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
        scrollTop:document.querySelector('main')?.scrollTop||0
      };
    },route);
    assert(state.active && !state.hidden,`${route}-nao-ativo`,issues);
    assert(state.current==='page',`${route}-sem-aria-current`,issues);
    assert(state.focused,`${route}-titulo-sem-foco`,issues);
    assert(state.scrollTop===0,`${route}-scroll-nao-resetado`,issues);
  }

  // Volta à Home pelo mesmo caminho de teclado.
  await page.locator('[data-route-link="home"]').focus();
  await page.keyboard.press('Enter');
  await page.waitForFunction(()=>document.querySelector('[data-route].is-active')?.dataset.route==='home');
  await page.waitForTimeout(40);
  const homeFocused=await page.evaluate(()=>document.activeElement===document.getElementById('home-title'));
  assert(homeFocused,'home-titulo-sem-foco-no-retorno',issues);

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
