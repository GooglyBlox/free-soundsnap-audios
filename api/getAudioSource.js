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

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
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