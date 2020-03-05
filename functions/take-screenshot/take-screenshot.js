const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {

    
    const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;

    if (!pageToScreenshot) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Page URL not defined' })
    }
    
      const browser = await chromium.puppeteer.launch();
      const page = await browser.newPage();
      await page.goto(pageToScreenshot);
      const screenshot = await page.screenshot({ encoding: 'binary' });
     
      await browser.close();
    
  
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            message: `Complete screenshot of ${pageToScreenshot}!`, 
            buffer: screenshot 
        })
    }

}
