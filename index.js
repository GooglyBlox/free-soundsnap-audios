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
        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

        await page.hover('span.ojoo-button.ojoo-play').catch(e => console.error('Error on hover:', e));

        await page.waitForSelector('audio', { timeout: 10000 }).catch(e => console.error('Error on waitForSelector:', e));

        const audioSrc = await page.evaluate(() => {
            const audio = document.querySelector('audio');
            return audio ? audio.src : null;
        });

        await browser.close();

        if (audioSrc) {
            res.json({ audioSrc });
        } else {
            res.json({ error: 'Audio source not found.' });
        }
    } catch (error) {
        console.error('Error in getAudioSource:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
