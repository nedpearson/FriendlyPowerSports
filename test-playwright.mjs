import { chromium } from 'playwright';

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
    console.log('Navigation:', e.message);
  }
  
  // Click on something to open Action modal
  try {
     console.log('Opening an action drilldown...');
     await page.evaluate(() => {
        window.clickFirstAction = () => {
           const actionButtons = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('View System Log') || b.innerText.includes('Deploy') || b.innerText.includes('Reassign') || b.innerText.includes('Convert') || b.innerText.includes('Export'));
           if(actionButtons[0]) actionButtons[0].click();
        }
        window.clickFirstAction();
     });
     await page.waitForTimeout(500);

     console.log('Clicking View System Log...');
     await page.evaluate(() => {
        const viewLogBtn = Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('View System Log'));
        if(viewLogBtn[0]) viewLogBtn[0].click();
     });
     await page.waitForTimeout(500);
     
  } catch(e) {
     console.log('Click failed', e.message);
  }
  
  const content = await page.content();
  if (content.includes('Application Crashed!')) {
    console.log('FOUND ERROR BOUNDARY!');
    console.log(await page.evaluate(() => document.body.innerText));
  } else {
    console.log('No crash detected.');
  }
  
  await browser.close();
})();
