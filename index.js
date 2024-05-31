import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/getAudioSource', async (req, res) => {
    const url = req.body.url;
    const logs = [];
    const log = (message) => {
        console.log(message);
        logs.push(message);
    };

    log(`Received request to fetch audio source from URL: ${url}`);
    try {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || puppeteer.executablePath(),
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        log('Puppeteer launched successfully');

        const page = await browser.newPage();
        await page.setRequestInterception(true);

        page.on('request', request => {
            request.continue();
        });

        let audioFilepath = null;

        page.on('response', async response => {
            const requestUrl = response.url();
            log(`Received response from URL: ${requestUrl}`);
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
                    log('Error parsing response JSON:', e);
                }
            }
        });

        log(`Navigating to URL: ${url}`);
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        log('Page navigation completed');
        await browser.close();

        if (audioFilepath) {
            log(`Audio source found: ${audioFilepath}`);
            res.json({ audioSrc: audioFilepath, logs });
        } else {
            log('Audio source not found');
            res.json({ error: 'Audio source not found.', logs });
        }
    } catch (error) {
        log('Error during Puppeteer operation:', error);
        res.status(500).json({ error: error.message, logs });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
