const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1024 });

  // Add the auth token to local storage so we can see the dashboard
  await page.goto('http://localhost:3006', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('token', 'dummy_token_for_testing');
    localStorage.setItem('userConfig', JSON.stringify({ role: 'PET_SCHOOL' }));
  });

  await page.goto('http://localhost:3006/school/analytics', { waitUntil: 'networkidle0' });
  
  // Wait a moment for any client-side rendering
  await new Promise(r => setTimeout(r, 2000));
  
  const timestamp = Date.now();
  const path = `/Users/foysal/.gemini/antigravity/brain/7d3da660-2bd0-49b0-902b-5c2f08025d26/pet_school_analytics_${timestamp}.png`;
  
  await page.screenshot({ path: path, fullPage: true });
  console.log(`Screenshot saved to: ${path}`);
  
  await browser.close();
})();
