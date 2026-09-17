import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173/#home');
await page.waitForSelector('#insert-cd');
await page.waitForFunction(()=>document.querySelectorAll('.boombox-hotspot').length===4);
assert.equal(await page.locator('.site-production-notice').count(),0);
assert.equal(await page.locator('.band-slogan').innerText(),'CONEXÃO CLANDESTINA — CONTEÚDO EXPLÍCITO');
assert.equal(await page.locator('#open-library').isVisible(),false);
assert.equal(await page.locator('#eject-cd').isVisible(),false);
assert.ok(await page.locator('.header-socials a[href="https://www.youtube.com/@TheAntiStateGuys"]').count()===1);
await page.locator('#insert-cd').click();
await page.waitForFunction(()=>document.querySelector('.music-machine').dataset.cdState==='ready',null,{timeout:15000});
await page.locator('#play-pause').click();
let media;
try{
 await page.waitForFunction(()=>document.getElementById('audio').currentTime>0.4,null,{timeout:20000});
 media=await page.locator('#audio').evaluate(a=>({currentTime:a.currentTime,duration:a.duration,paused:a.paused,error:a.error?.code||null}));
 assert.ok(!media.paused && media.duration>0 && !media.error);
 await page.locator('#stop-track').click();
 assert.equal(await page.locator('#audio').evaluate(a=>a.currentTime),0);
 assert.equal(await page.locator('#audio').evaluate(a=>a.paused),true);
 assert.equal(await page.locator('.music-machine').getAttribute('data-cd-state'),'ready');
 await page.locator('#next-track').click();
 assert.match(await page.locator('#track-title').innerText(),/Não Há Cor/);
 await page.locator('#prev-track').click();
 assert.equal(await page.locator('#track-title').innerText(),'Renascer');
}catch(error){media={verified:false,reason:error.message,state:await page.locator('#audio').evaluate(a=>({src:a.currentSrc,readyState:a.readyState,networkState:a.networkState,error:a.error?.message||null}))};}
const nativeGeometry=await page.evaluate(()=>{
 const radio=document.querySelector('.boombox-art').getBoundingClientRect();
 const ids=['stop-track','prev-track','play-pause','next-track'];
 const boxes=ids.map(id=>({id,r:document.getElementById(id).getBoundingClientRect()}));
 return {
  count:boxes.length,
  inside:boxes.every(({r})=>r.left>=radio.left-2&&r.right<=radio.right+2&&r.top>=radio.top-2&&r.bottom<=radio.bottom+2),
  overlaps:boxes.flatMap((a,i)=>boxes.slice(i+1).filter(b=>Math.min(a.r.right,b.r.right)-Math.max(a.r.left,b.r.left)>1&&Math.min(a.r.bottom,b.r.bottom)-Math.max(a.r.top,b.r.top)>1).map(b=>a.id+':'+b.id))
 };
});
assert.equal(nativeGeometry.count,4);
assert.equal(nativeGeometry.inside,true);
assert.deepEqual(nativeGeometry.overlaps,[]);
await page.goto('http://127.0.0.1:4173/#historia');
assert.match(await page.locator('.history-start').innerText(),/fevereiro de 2024/);
assert.doesNotMatch(await page.locator('.history-start').innerText(),/2025/);
await page.goto('http://127.0.0.1:4173/#integrantes');
assert.deepEqual(await page.locator('.member-card h3').allTextContents(),['Bobby Dias','Break','Lukas McFly','Marcus Young','Thomaz','Santiago']);
for(const detail of await page.locator('.member-card summary').all()){
 await detail.click();assert.equal(await detail.evaluate(s=>s.parentElement.open),true);
 await detail.click();
}
let contactPosted=false;
await page.route('https://api.web3forms.com/submit',async route=>{
 contactPosted=true;
 await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({success:true,message:'OK'})});
});
await page.goto('http://127.0.0.1:4173/#contato');
assert.equal(await page.locator('#contact-form').evaluate(f=>f.checkValidity()),false);
assert.ok(await page.locator('a[href="mailto:theantistateguys@gmail.com"]').count());
assert.match(await page.locator('.contact-form-note').innerText(),/enviada diretamente/);
await page.locator('#contact-form input[name="name"]').fill('Teste QA');
await page.locator('#contact-form input[name="email"]').fill('qa@example.com');
await page.locator('#contact-form input[name="subject"]').fill('Teste de formulário');
await page.locator('#contact-form textarea[name="message"]').fill('Validação local do envio direto.');
await page.locator('#contact-form button[type="submit"]').click();
await page.waitForFunction(()=>document.getElementById('contact-form-status').textContent.includes('Mensagem enviada com sucesso'));
assert.equal(contactPosted,true);
assert.match(page.url(),/#contato$/);
assert.deepEqual(errors,[]);
const result={passed:true,media,nativeGeometry,checks:['only official slogan','no provisional notice','CD sequence and native transport hotspots','no auxiliary EJECT/library chrome','official YouTube access in header','history 2024','six actual members and biographies','contact direct Web3Forms submission and official email'],errors};
await fs.writeFile('test-artifacts/canon-contract.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await browser.close();
