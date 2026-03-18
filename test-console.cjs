const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    page.on('console', msg => {
        if (msg.text().includes('[DEBUG]') || msg.type() === 'error' || msg.text().includes('AgentRegistry') || msg.text().includes('RecommendationService')) {
           console.log('BROWSER CONSOLE:', msg.text());
        }
    });
    
    console.log('Running test trace...');
    try {
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle' });
        
        // Find and click the 'AI Command Center' or 'Omni-Command' tab
        console.log("Locating Omni-Command Tab");
        await page.evaluate(() => {
            const tabs = Array.from(document.querySelectorAll('button'));
            const commandTab = tabs.find(b => b.textContent && b.textContent.includes('Omni-Command'));
            if (commandTab) commandTab.click();
        });
        
        await page.waitForTimeout(3000);
        console.log('Test trace complete.');
    } catch(e) {
        console.log(e);
    }
    
    await browser.close();
})();
