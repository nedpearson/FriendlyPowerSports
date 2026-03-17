const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  console.log('Navigating to http://localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 5000 });
  } catch(e) {
    console.log('Navigation error/timeout:', e.message);
  }
  
  const content = await page.content();
  if (content.includes('Application Crashed!')) {
    console.log('FOUND ERROR BOUNDARY!');
    console.log(await page.evaluate(() => document.body.innerText));
  } else {
    console.log('No error boundary visible. Body length:', content.length);
  }
  
  await browser.close();
})();
