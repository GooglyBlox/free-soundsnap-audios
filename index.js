import express from 'express';
import bodyParser from 'body-parser';
import puppeteer from 'puppeteer';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/getAudioSource', async (req, res) => {
    const url = req.body.url;
    try {
        const browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
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
            res.json({ audioSrc: audioFilepath });
        } else {
            res.json({ error: 'Audio source not found.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
