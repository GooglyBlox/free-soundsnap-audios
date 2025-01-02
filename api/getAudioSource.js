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

  let browser;
  try {
    browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox'],
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(30000);
    await page.setDefaultTimeout(30000);
    await page.setRequestInterception(true);

    let audioFilepath = null;
    let navigationPromise;

    page.on('request', request => {
      if (['image', 'stylesheet', 'font'].includes(request.resourceType())) {
        request.abort();
      } else {
        request.continue();
      }
    });

    page.on('response', async response => {
      const requestUrl = response.url();
      if (requestUrl.includes("search-soundsnap.com/collections/")) {
        try {
          const responseJson = await response.json();
          const hits = responseJson?.hits;
          if (hits && hits.length > 0) {
            const document = hits[0].document;
            if (document && document['audio.filepath']) {
              if(url.includes("/stock-music/")) {
                audioFilepath = `https://www.soundsnap.com/stock-music/play?t=e&p=${document['audio.filepath']}`;
              } else {
                audioFilepath = `https://www.soundsnap.com/play?t=e&p=${document['audio.filepath']}`;
              }
            }
          }
        } catch (e) {
          console.error('Error parsing response JSON:', e);
        }
      }
    });

    navigationPromise = page.goto(url, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Navigation timeout')), 30000)
    );

    await Promise.race([navigationPromise, timeoutPromise]);

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
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (error) {
        console.error('Error closing browser:', error);
      }
    }
  }
};