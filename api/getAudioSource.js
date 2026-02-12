const chromium = require('@sparticuz/chromium');
let puppeteer;

if (process.env.VERCEL) {
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

module.exports = async (req, res) => {
  console.log('Received request:', req.method === 'POST' ? req.body : req.query);
  const url = req.method === 'POST' ? req.body.url : req.query.url;
  const directDownload = req.method === 'GET';

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.setRequestInterception(true);

    page.on('request', request => {
      request.continue();
    });

    let audioFilepath = null;

    page.on('response', async response => {
      const requestUrl = response.url();
      
      if (requestUrl.includes("soundsnap")) {
        console.log('SoundSnap request:', requestUrl);
      }
      
      if (requestUrl.includes("soundsnap-prod.nyc3.digitaloceanspaces.com") && 
          requestUrl.includes("/transcode/") && 
          requestUrl.includes(".mp3")) {
        audioFilepath = requestUrl;
        console.log('Captured audio URL:', audioFilepath);
      }
    });

    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    
    try {
      await page.waitForSelector('.ojoo-play', { timeout: 5000 });
      await page.click('.ojoo-play');
      console.log('Clicked play button');
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('Could not click play button:', e.message);
    }
    
    await browser.close();

    if (audioFilepath) {
      console.log('Found audio source:', audioFilepath);
      if (directDownload) {
        res.redirect(audioFilepath);
      } else {
        res.json({ audioSrc: audioFilepath });
      }
    } else {
      console.log('No audio source found.');
      res.status(404).json({ error: 'Audio source not found.' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};