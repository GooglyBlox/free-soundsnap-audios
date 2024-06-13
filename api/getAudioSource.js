let puppeteer;

if (process.env.CHROME_EXECUTABLE_PATH) {
  puppeteer = require('puppeteer-core');
} else {
  puppeteer = require('puppeteer');
}

module.exports = async (req, res) => {
  console.log('Received request:', req.body);
  const { url } = req.body;
  try {
    let launchOptions = {
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    };

    if (process.env.CHROME_EXECUTABLE_PATH) {
      const chromium = require('@sparticuz/chromium');
      launchOptions.executablePath = process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath());
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    let audioFilepath = null;

    page.on('response', async (response) => {
      const requestUrl = response.url();
      if (requestUrl.includes("search-soundsnap.com/collections/")) {
        try {
          const responseJson = await response.json();
          const hits = responseJson?.hits;
          if (hits && hits.length > 0) {
            const document = hits[0].document;
            if (document && document['audio.filepath']) {
              audioFilepath = `https://www.soundsnap.com/play?t=e&p=${document['audio.filepath']}`;
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
      res.json({ audioSrc: audioFilepath });
    } else {
      console.log('No audio source found.');
      res.json({ error: 'Audio source not found.' });
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
};