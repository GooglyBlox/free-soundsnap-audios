import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/getAudioSource', async (req, res) => {
    const url = req.body.url;
    console.log(`Received request to fetch audio source from URL: ${url}`);
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        console.log('Puppeteer launched successfully');

        const page = await browser.newPage();
        await page.setRequestInterception(true);

        page.on('request', request => {
            request.continue();
        });

        let audioFilepath = null;

        page.on('response', async response => {
            const requestUrl = response.url();
            console.log(`Received response from URL: ${requestUrl}`);
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

        console.log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        console.log('Page navigation completed');
        await browser.close();

        if (audioFilepath) {
            console.log(`Audio source found: ${audioFilepath}`);
            res.json({ audioSrc: audioFilepath });
        } else {
            console.log('Audio source not found');
            res.json({ error: 'Audio source not found.' });
        }
    } catch (error) {
        console.error('Error during Puppeteer operation:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
