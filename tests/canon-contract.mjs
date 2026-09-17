import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import fs from 'node:fs/promises';
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:390,height:844},hasTouch:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173/#home');
await page.waitForSelector('#insert-cd');
await page.waitForFunction(()=>document.querySelector('.music-machine')?.classList.contains('boombox-native-controls'));
assert.equal(await page.locator('.site-production-notice').count(),0);
assert.equal(await page.locator('.band-slogan').innerText(),'CONEXÃO CLANDESTINA — CONTEÚDO EXPLÍCITO');

// Canon 17/09: the approved photograph owns the interaction. There is no
// visible CD/FAIXAS or EJECT interface layered on top of the radio.
assert.equal(await page.locator('#open-library').isHidden(),true);
assert.equal(await page.locator('#eject-cd').isHidden(),true);
assert.equal(await page.locator('#open-library').isDisabled(),true);
assert.equal(await page.locator('#eject-cd').isDisabled(),true);

await page.locator('#insert-cd').click();
await page.waitForFunction(()=>document.querySelector('.music-machine').dataset.cdState==='ready',null,{timeout:15000});
for(const id of ['prev-track','stop-track','play-pause','next-track']){
 assert.equal(await page.locator(`#${id}`).isDisabled(),false);
 assert.ok(await page.locator(`#${id}`).evaluate(el=>el.classList.contains('boombox-hotspot')));
}

await page.locator('#play-pause').click();
let media;
try{
 await page.waitForFunction(()=>document.getElementById('audio').currentTime>0.4,null,{timeout:20000});
 media=await page.locator('#audio').evaluate(a=>({currentTime:a.currentTime,duration:a.duration,paused:a.paused,error:a.error?.code||null}));
 assert.ok(!media.paused && media.duration>0 && !media.error);
 await page.locator('#stop-track').click();
 assert.equal(await page.locator('#audio').evaluate(a=>a.currentTime),0);
 await page.locator('#next-track').click();
 assert.match(await page.locator('#track-title').innerText(),/Não Há Cor/);
 await page.locator('#prev-track').click();
 assert.equal(await page.locator('#track-title').innerText(),'Renascer');
}catch(error){media={verified:false,reason:error.message,state:await page.locator('#audio').evaluate(a=>({src:a.currentSrc,readyState:a.readyState,networkState:a.networkState,error:a.error?.message||null}))};}

// The official media catalog remains present in the document even though the
// old visible library button was retired from the physical-radio experience.
assert.ok(await page.locator('.official-videos a').count()>=3);
assert.equal(await page.locator('.music-machine').getAttribute('data-cd-state'),'ready');
assert.equal(await page.locator('#audio').evaluate(a=>a.paused),true);
assert.equal(await page.locator('#audio').evaluate(a=>a.currentTime),0);

await page.goto('http://127.0.0.1:4173/#historia');
assert.match(await page.locator('.history-start').innerText(),/fevereiro de 2024/);
assert.doesNotMatch(await page.locator('.history-start').innerText(),/2025/);
await page.goto('http://127.0.0.1:4173/#integrantes');
assert.deepEqual(await page.locator('.member-card h3').allTextContents(),['Bobby Dias','Break','Lukas McFly','Marcus Young','Thomaz','Santiago']);
for(const detail of await page.locator('.member-card summary').all()){
 await detail.click();assert.equal(await detail.evaluate(s=>s.parentElement.open),true);
 await detail.click();
}
await page.goto('http://127.0.0.1:4173/#contato');
assert.equal(await page.locator('#contact-form').evaluate(f=>f.checkValidity()),false);
assert.ok(await page.locator('a[href="mailto:theantistateguys@gmail.com"]').count());
assert.match(await page.locator('.contact-form-note').innerText(),/aplicativo de e-mail/);
assert.deepEqual(errors,[]);
const result={passed:true,media,checks:['only official slogan','no provisional notice','native boombox CD sequence and physical transport hotspots','no artificial EJECT or CD/FAIXAS controls','official video feed remains available in document','history 2024','six actual members and biographies','contact validation and official email'],errors};
await fs.writeFile('test-artifacts/canon-contract.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
await browser.close();
