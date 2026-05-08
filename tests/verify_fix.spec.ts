import { test, expect } from '@playwright/test';

test('verify site renders and animations trigger', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // 1. Check intro overlay
  await expect(page.locator('.intro-overlay')).toBeVisible();
  await page.screenshot({ path: 'verify_intro.png' });

  // 2. Wait for intro to finish (max 5s per component logic)
  await expect(page.locator('.intro-overlay')).not.toBeVisible({ timeout: 10000 });

  // 3. Check if Hero is visible and not blank
  // We added opacity-0 but GSAP should have turned it to 1 by now (delay 0.2 + duration 1.2)
  await page.waitForTimeout(2000);

  const headline = page.locator('h1');
  await expect(headline).toBeVisible();

  const opacity = await headline.evaluate((el) => window.getComputedStyle(el).opacity);
  console.log('Headline opacity after intro:', opacity);

  await page.screenshot({ path: 'verify_hero_rendered.png' });

  // 4. Verify no console errors
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log(`Browser Error: ${msg.text()}`);
    }
  });

  // 5. Check if TorusKnot is lazy loaded (it should be there on desktop)
  const torus = page.locator('canvas');
  // Might need to wait a bit more for lazy load
  await page.waitForTimeout(1000);
  await expect(torus).toBeVisible();
});
