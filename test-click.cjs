const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.text().includes('[DEBUG]') || msg.text().includes('[DEBUG LIA]') || msg.type() === 'error') {
           console.log('BROWSER CONSOLE:', msg.text());
        }
    });
    
    console.log('Navigating to login...');
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    console.log('Clicking Sign In...');
    await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent && b.textContent.includes('Sign In'));
        if (btn) btn.click();
    });
    
    await page.waitForTimeout(1000);
    
    console.log('Checking view...');
    const result = await page.evaluate(() => {
        const text = document.body.innerText;
        const reviewMatch = text.match(/Review \(\d+\)/);
        return reviewMatch ? reviewMatch[0] : 'Not Found';
    });
    
    console.log('DOM RESULT:', result);
    
    await browser.close();
})();
