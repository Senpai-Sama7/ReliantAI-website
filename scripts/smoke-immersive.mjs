#!/usr/bin/env node
/**
 * Smoke test: immersive sections mount, assets resolve, critical DOM present.
 * Run after `npm run build && npm run preview` or against dev server.
 *
 * Usage: node scripts/smoke-immersive.mjs [baseUrl]
 */
import { setTimeout as sleep } from 'node:timers/promises';

if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('Usage: node scripts/smoke-immersive.mjs [baseUrl]');
  console.log('Default baseUrl: http://127.0.0.1:4173');
  process.exit(0);
}

const BASE = process.argv[2] ?? 'http://127.0.0.1:4173';
const failures = [];

function fail(msg) {
  failures.push(msg);
  console.error(`FAIL: ${msg}`);
}

async function fetchText(path) {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) fail(`${path} → HTTP ${res.status}`);
  return res.text();
}

async function fetchHead(path) {
  const res = await fetch(`${BASE}${path}`, { method: 'HEAD' });
  if (!res.ok) fail(`${path} → HTTP ${res.status}`);
  return res;
}

console.log(`smoke-immersive: ${BASE}`);

await fetchText('/');

for (const img of [
  '/project-metalforge.webp',
  '/project-oilfield.webp',
  '/project-homeservices.webp',
  '/project-medical.webp',
]) {
  await fetchHead(img);
}

let playwright;
try {
  playwright = await import('playwright');
} catch {
  playwright = null;
}

async function dismissExitIntent(page) {
  const dismissPopup = page.getByRole('button', { name: /no thanks/i });
  if (await dismissPopup.isVisible().catch(() => false)) {
    await dismissPopup.click();
  }
}

async function waitForIntro(page) {
  await sleep(6500);
  await dismissExitIntent(page);
}

async function assertScrollStoryBeats(browser, contextOptions, label) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  try {
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await waitForIntro(page);

    await page.evaluate(() => {
      const worlds = document.getElementById('worlds');
      if (!worlds) throw new Error('#worlds missing');
      const top = worlds.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + 40);
    });
    await sleep(800);

    const beatCount = await page.locator('.story-beat').count();
    if (beatCount < 4) {
      fail(`${label}: expected 4 story beats, found ${beatCount}`);
      return;
    }

    await page.evaluate(() => {
      const worlds = document.getElementById('worlds');
      if (!worlds) throw new Error('#worlds missing');
      const top = worlds.getBoundingClientRect().top + window.scrollY;
      window.scrollTo(0, top + worlds.offsetHeight * 0.55);
    });
    await sleep(1500);

    const progress = await page.evaluate(() => {
      const bar = document.querySelector('.story-beat-progress');
      return bar ? parseFloat(bar.style.width || '0') : 0;
    });

    if (progress < 8) {
      fail(`${label}: scroll story progress did not advance (width=${progress}%)`);
    }
  } catch (err) {
    fail(`${label}: scroll story check failed: ${err instanceof Error ? err.message : String(err)}`);
  } finally {
    await context.close();
  }
}

if (!playwright) {
  console.warn('playwright not installed — DOM scroll checks skipped (asset HEAD checks OK)');
} else {
  let browser;
  try {
    browser = await playwright.chromium.launch({ headless: true });
  } catch (err) {
    fail(`playwright launch failed: ${err instanceof Error ? err.message : String(err)}`);
    browser = null;
  }
  if (browser) {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await waitForIntro(page);
    await dismissExitIntent(page);

    const hero = await page.$('#hero');
    const worlds = await page.$('#worlds');
    const work = await page.$('#work');
    const services = await page.$('#services');
    const testimonials = await page.$('#testimonials');
    if (!hero) fail('runtime: #hero not in DOM');
    if (!worlds) fail('runtime: #worlds not in DOM');
    if (!work) fail('runtime: #work not in DOM');
    if (!services) fail('runtime: #services not in DOM');
    if (!testimonials) fail('runtime: #testimonials not in DOM');

    const crown = await page.$('#hero header');
    if (!crown) fail('runtime: hero crown header missing');

    const zoneHud = await page.$('.zone-hud');
    if (!zoneHud) fail('runtime: zone HUD missing');

    const announcer = await page.$('#zone-announcer');
    if (!announcer) fail('runtime: zone announcer missing');

    const worldsHeight = await page.evaluate(() => {
      const el = document.getElementById('worlds');
      return el ? el.offsetHeight : 0;
    });
    if (worldsHeight < 400) fail(`runtime: #worlds height too small (${worldsHeight}px)`);

    const cta = page.getByRole('button', { name: /enter the worlds/i });
    if (!(await cta.isVisible().catch(() => false))) {
      fail('runtime: Enter The Worlds CTA not visible');
    } else {
      await cta.click();
      await sleep(2000);
      const scrollY = await page.evaluate(() => window.scrollY);
      if (scrollY < 50) fail(`runtime: CTA scroll did not advance (scrollY=${scrollY})`);
    }

    await assertScrollStoryBeats(browser, { viewport: { width: 1280, height: 800 } }, 'desktop story');
    await assertScrollStoryBeats(
      browser,
      { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true },
      'mobile story'
    );

    await browser.close();
  }
}

if (failures.length) {
  console.error(`\nsmoke-immersive: ${failures.length} failure(s)`);
  process.exit(1);
}

console.log('smoke-immersive: PASS');
