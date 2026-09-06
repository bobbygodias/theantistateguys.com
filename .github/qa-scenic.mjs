import { chromium } from 'playwright';
import fs from 'node:fs';

fs.mkdirSync('qa-screenshots', { recursive: true });
const browser = await chromium.launch({ headless: true });
const errors = [];

async function readyPage(viewport) {
  const page = await browser.newPage({ viewport });
  page.on('console', msg => { if (msg.type() === 'error') errors.push(`console: ${msg.text()}`); });
  page.on('pageerror', err => errors.push(`pageerror: ${err.message}`));
  return page;
}

async function assertDecodableImage(page, path) {
  const result = await page.evaluate(async src => new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ ok: img.naturalWidth > 0 && img.naturalHeight > 0, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ ok: false, width: 0, height: 0 });
    img.src = `${src}?qa=${Date.now()}`;
  }), path);
  if (!result.ok) throw new Error(`Browser could not decode image: ${path}`);
  console.log(`decoded ${path}: ${result.width}x${result.height}`);
}

async function assertHomeMode(page, name, viewport) {
  const ratio = viewport.width / viewport.height;
  const desktopVisible = await page.locator('.desktop-stage').isVisible();
  const mobileVisible = await page.locator('.mobile-home').isVisible();
  const expectWide = ratio >= 1.1;
  if (expectWide && (!desktopVisible || mobileVisible)) {
    throw new Error(`${name}: expected wide scenic mode at ratio ${ratio.toFixed(2)}`);
  }
  if (!expectWide && (desktopVisible || !mobileVisible)) {
    throw new Error(`${name}: expected recomposed scenic mode at ratio ${ratio.toFixed(2)}`);
  }
}

async function assertHomeTargets(page, name) {
  const selector = (await page.locator('.mobile-home').isVisible())
    ? '.mobile-signs a, .mobile-video-card, .mobile-library, .mobile-controls button, .mobile-socials a'
    : '.hotspot, .player-hit, .photo-sign';
  const boxes = await page.locator(selector).evaluateAll(nodes => nodes
    .filter(n => {
      const s = getComputedStyle(n);
      return s.display !== 'none' && s.visibility !== 'hidden';
    })
    .map(n => {
      const r = n.getBoundingClientRect();
      return { w: r.width, h: r.height, label: n.getAttribute('aria-label') || n.textContent?.trim() || n.className };
    }));
  const tiny = boxes.filter(b => b.w < 28 || b.h < 28);
  if (tiny.length) throw new Error(`${name}: interactive target below 28px: ${JSON.stringify(tiny.slice(0, 5))}`);
}

async function capture(name, viewport, hash = '#home', fullPage = false, homeChecks = false) {
  const page = await readyPage(viewport);
  await page.goto(`http://127.0.0.1:4173/${hash}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.waitForTimeout(700);
  const route = hash.replace('#', '') || 'home';
  if (!(await page.locator(`[data-route="${route}"]`).isVisible())) throw new Error(`${name}: route ${route} is not visible`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
  if (overflow) throw new Error(`${name}: horizontal overflow detected`);
  if (homeChecks) {
    await assertHomeMode(page, name, viewport);
    await assertHomeTargets(page, name);
  }
  await page.screenshot({ path: `qa-screenshots/${name}.png`, fullPage });
  await page.close();
}

const probe = await readyPage({ width: 900, height: 700 });
await probe.goto('http://127.0.0.1:4173/#home', { waitUntil: 'domcontentloaded', timeout: 15000 });
for (const path of [
  '/assets/home-scene.webp',
  '/assets/wordmark.svg',
  '/assets/photos-pose-6.webp',
  '/assets/studio.webp',
  '/assets/members/thomaz.webp',
  '/assets/history-wall.svg'
]) await assertDecodableImage(probe, path);
await probe.close();

const homeMatrix = [
  ['home-320x568', { width: 320, height: 568 }, true],
  ['home-360x640', { width: 360, height: 640 }, true],
  ['home-375x667', { width: 375, height: 667 }, true],
  ['home-390x844', { width: 390, height: 844 }, true],
  ['home-430x932', { width: 430, height: 932 }, true],
  ['home-600x1024', { width: 600, height: 1024 }, true],
  ['home-800x1280', { width: 800, height: 1280 }, true],
  ['home-768x1024', { width: 768, height: 1024 }, true],
  ['home-900x600', { width: 900, height: 600 }, false],
  ['home-1024x768', { width: 1024, height: 768 }, false],
  ['home-1280x800', { width: 1280, height: 800 }, false],
  ['home-1672x941', { width: 1672, height: 941 }, false],
  ['home-1920x1080', { width: 1920, height: 1080 }, false],
  ['home-2560x1080', { width: 2560, height: 1080 }, false]
];
for (const [name, viewport, fullPage] of homeMatrix) {
  await capture(name, viewport, '#home', fullPage, true);
}

await capture('historia-1440', { width: 1440, height: 900 }, '#historia', true);
await capture('historia-mobile-390x844', { width: 390, height: 844 }, '#historia', true);
await capture('integrantes-1440', { width: 1440, height: 900 }, '#integrantes', true);
await capture('integrantes-mobile-390x844', { width: 390, height: 844 }, '#integrantes', true);
await capture('fotos-1440', { width: 1440, height: 900 }, '#fotos', true);
await capture('shows-1440', { width: 1440, height: 900 }, '#shows', true);
await capture('contato-1440', { width: 1440, height: 900 }, '#contato', true);

const page = await readyPage({ width: 1440, height: 900 });
await page.goto('http://127.0.0.1:4173/#home', { waitUntil: 'domcontentloaded', timeout: 15000 });
await page.waitForFunction(() => {
  const t = document.querySelector('#track-title')?.textContent || '';
  return t && !t.includes('Carregando');
}, null, { timeout: 10000 });
const title = await page.locator('#track-title').textContent();
if (!title || title.includes('indispon')) throw new Error(`Music catalog failed: ${title}`);
await page.evaluate(() => { window.location.hash = '#historia'; });
await page.waitForFunction(() => {
  const el = document.querySelector('[data-route="historia"]');
  return !!el && !el.hidden;
}, null, { timeout: 5000 });
if (!(await page.locator('#audio').count())) throw new Error('Audio element did not persist through route navigation');
await page.close();

fs.writeFileSync('qa-screenshots/console-errors.txt', errors.join('\n') || 'none\n');
await browser.close();
const fatal = errors.filter(line => line.includes('pageerror:'));
if (fatal.length) { console.error(fatal.join('\n')); process.exitCode = 1; }
else console.log('Responsive QA completed across a viewport/aspect-ratio matrix plus internal routes.');
