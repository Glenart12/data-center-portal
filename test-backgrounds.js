const { chromium } = require('playwright');

async function compareBackgrounds() {
  const browser = await chromium.launch({ headless: false });
  
  try {
    // Create two browser contexts
    const context1 = await browser.newContext({
      viewport: { width: 1400, height: 900 }
    });
    const context2 = await browser.newContext({
      viewport: { width: 1400, height: 900 }
    });
    
    // Open frontend and backend
    const frontendPage = await context1.newPage();
    const backendPage = await context2.newPage();
    
    console.log('Opening frontend...');
    await frontendPage.goto('http://localhost:3001'); // Frontend port
    
    console.log('Opening backend dashboard...');
    await backendPage.goto('http://localhost:3000/dashboard'); // Backend dashboard
    
    // Wait for both pages to load
    await frontendPage.waitForTimeout(3000);
    await backendPage.waitForTimeout(3000);
    
    // Take screenshots for comparison
    await frontendPage.screenshot({ 
      path: 'frontend-background.png',
      fullPage: false 
    });
    
    await backendPage.screenshot({ 
      path: 'backend-dashboard-background.png',
      fullPage: false 
    });
    
    console.log('Screenshots saved:');
    console.log('- frontend-background.png');
    console.log('- backend-dashboard-background.png');
    
    // Extract background styles from both pages
    const frontendBg = await frontendPage.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      return {
        backgroundColor: computedStyle.backgroundColor,
        backgroundImage: computedStyle.backgroundImage,
        backgroundSize: computedStyle.backgroundSize
      };
    });
    
    const backendBg = await backendPage.evaluate(() => {
      const body = document.body;
      const computedStyle = window.getComputedStyle(body);
      const dashboardDiv = document.querySelector('div[style*="padding: \'32px\'"]');
      const bgDiv = document.querySelector('div[style*="position: \'fixed\'"]');
      
      return {
        body: {
          backgroundColor: computedStyle.backgroundColor,
          backgroundImage: computedStyle.backgroundImage,
          backgroundSize: computedStyle.backgroundSize
        },
        dashboard: dashboardDiv ? {
          styles: dashboardDiv.getAttribute('style')
        } : null,
        backgroundLayer: bgDiv ? {
          styles: bgDiv.getAttribute('style')
        } : null
      };
    });
    
    console.log('\n--- Frontend Background ---');
    console.log(JSON.stringify(frontendBg, null, 2));
    
    console.log('\n--- Backend Background ---');
    console.log(JSON.stringify(backendBg, null, 2));
    
    // Keep browser open for manual inspection
    console.log('\nBrowser windows kept open for inspection. Press Ctrl+C to close.');
    await new Promise(() => {}); // Keep running
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

// Run the comparison
compareBackgrounds().catch(console.error);