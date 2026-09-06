import { chromium } from 'playwright';
import fs from 'node:fs';

fs.mkdirSync('qa-screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];

async function capture(name, viewport, hash = '#home', fullPage = false) {
  const page = await browser.newPage({ viewportSize: viewport });
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`${name}: console: ${msg.text()}`);
  });
  page.on('pageerror', err => errors.push(`${name}: pageerror: ${err.message}`));
  await page.goto(`http://127.0.0.1:4173/${hash}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(350);

  const route = hash.replace('#', '') || 'home';
  const visible = await page.locator(`[data-route="${route}"]`).isVisible();
  if (!visible) throw new Error(`${name}: route ${route} is not visible`);

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) throw new Error(`${name}: horizontal overflow detected`);

  await page.screenshot({ path: `qa-screenshots/${name}.png`, fullPage });
  await page.close();
}

const assetPaths = [
  '/assets/home-scene.webp',
  '/assets/wordmark.svg',
  '/assets/photos-pose-6.webp',
  '/assets/studio.webp',
  '/assets/members/thomaz.webp',
];

const probe = await browser.newPage();
for (const path of assetPaths) {
  const response = await probe.goto(`http://127.0.0.1:4173${path}`);
  if (!response || !response.ok()) throw new Error(`Asset failed: ${path}`);
}
await probe.close();

await capture('home-1672x941', { width: 1672, height: 941 }, '#home', false);
await capture('home-1440x900', { width: 1440, height: 900 }, '#home', false);
await capture('home-mobile-390x844', { width: 390, height: 844 }, '#home', true);
await capture('historia-1440', { width: 1440, height: 900 }, '#historia', true);
await capture('integrantes-1440', { width: 1440, height: 900 }, '#integrantes', true);
await capture('integrantes-mobile', { width: 390, height: 844 }, '#integrantes', true);
await capture('fotos-1440', { width: 1440, height: 900 }, '#fotos', true);
await capture('shows-1440', { width: 1440, height: 900 }, '#shows', true);
await capture('contato-1440', { width: 1440, height: 900 }, '#contato', true);

// Player smoke test: catalog must load and route changes must not replace the audio element.
const page = await browser.newPage({ viewportSize: { width: 1440, height: 900 } });
await page.goto('http://127.0.0.1:4173/#home', { waitUntil: 'networkidle' });
await page.waitForFunction(() => document.querySelector('#track-title')?.textContent && !document.querySelector('#track-title').textContent.includes('Carregando'), null, { timeout: 10000 });
const before = await page.locator('#audio').evaluate(el => el === document.querySelector('#audio'));
await page.locator('[data-route-link="historia"]').first().click();
await page.waitForTimeout(150);
const after = await page.locator('#audio').evaluate(el => el === document.querySelector('#audio'));
if (!before || !after) throw new Error('Audio element did not persist through route navigation');
await page.close();

fs.writeFileSync('qa-screenshots/console-errors.txt', errors.join('\n') || 'none\n');
await browser.close();

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('Visual/route QA completed without browser console errors.');
}
