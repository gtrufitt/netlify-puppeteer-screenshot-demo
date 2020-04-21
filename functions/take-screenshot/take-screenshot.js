const chromium = require('chrome-aws-lambda');

exports.handler = async (event, context) => {

    
    const pageToScreenshot = JSON.parse(event.body).pageToScreenshot;
    
    const autoScroll = async page => {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          let totalHeight = 0;
          let distance = 200;
          window.scrollTo(0, 0);
          let timer = setInterval(() => {
            let scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 300);
        });
      });
    };

    if (!pageToScreenshot) return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Page URL not defined' })
    }
    
      const browser = await chromium.puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath,
        headless: chromium.headless,
      });
      const page = await browser.newPage();
      await page.setViewport({width: pupeteerScreenshotSettings.defaultViewport.width, height: 2000});
      await page.goto(pageToScreenshot, { waitUntil: ["load", "networkidle2"] });
      await autoScroll(page);
      const screenshot = await page.screenshot({ encoding: 'base64' });
     
      await browser.close();
    
  
    return {
        statusCode: 200,
         body: JSON.stringify({ 
                message: `Complete screenshot of ${pageToScreenshot}!`, 
                data: screenshot 
            }),
        headers: {
        'Content-Type': 'image/png',
    }
    }


}
