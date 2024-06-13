const PCR = require('puppeteer-chromium-resolver');
const puppeteer = require('puppeteer-core');

module.exports = async (req, res) => {
  console.log('Received request:', req.body);
  const { url } = req.body;
  try {
    const stats = await PCR({
      folderName: '.chromium-browser-snapshots',
      hosts: ['https://storage.googleapis.com', 'https://npm.taobao.org/mirrors'],
      retry: 3,
    });
    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      executablePath: stats.executablePath,
    });
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