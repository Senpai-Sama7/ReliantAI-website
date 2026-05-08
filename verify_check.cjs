const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  try {
    // Serve the dist folder
    const { exec } = require('child_process');
    const server = exec('npx vite preview --port 4173');
    await new Promise(r => setTimeout(r, 2000));

    await page.goto('http://localhost:4173', { timeout: 30000 });
    await page.waitForTimeout(10000);
    await page.screenshot({ path: 'prod_verification.png', fullPage: true });

    server.kill();
  } catch (e) {
    console.log(e);
  }
  await browser.close();
})();
