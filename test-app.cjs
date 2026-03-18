const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
    
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
    
    console.log('--- EXECUTING JS IN CONTEXT ---');
    const logs = await page.evaluate(async () => {
        // Find Omni-Command Tab
        const tabs = Array.from(document.querySelectorAll('button'));
        const commandTab = tabs.find(b => b.textContent && b.textContent.includes('Omni-Command'));
        if (commandTab) commandTab.click();
        
        await new Promise(r => setTimeout(r, 1000)); // wait for render
        
        const tabs2 = Array.from(document.querySelectorAll('button'));
        const reviewTab = tabs2.find(b => b.textContent && b.textContent.includes('Review ('));
        return { tabText: reviewTab ? reviewTab.textContent : 'Tab Not Found' };
    });
    console.log('RESULTS:', logs);
    
    await browser.close();
})();
