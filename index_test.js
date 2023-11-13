import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import puppeteer from "https://deno.land/x/puppeteer@16.2.0/mod.ts";

const app = new Application();
const router = new Router();
const PORT = 3000;

router.post('/getAudioSource', async (context) => {
    try {
        const body = await context.request.body().value;
        const url = body.url;

        const browser = await puppeteer.launch({
            headless: true,
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
            if (requestUrl.includes("search-soundsnap.com/collections/prod/documents/search")) {
                try {
                    const responseJson = await response.json();
                    const hits = responseJson?.hits;
                    if (hits && hits.length > 0) {
                        const document = hits[0].document;
                        if (document && document['audio.filepath']) {
                            if (url.startsWith("https://www.soundsnap.com/stock-music/")) {
                                audioFilepath = `https://www.soundsnap.com/stock-music/play?t=e&p=${document['audio.filepath']}`;
                            } else {
                                audioFilepath = `https://www.soundsnap.com/play?t=e&p=${document['audio.filepath']}`;
                            }
                        }
                    }
                } catch (_e) {
                    // shouldn't error technically ¯\_(ツ)_/¯
                }
            }
        });

        await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
        await browser.close();

        if (audioFilepath) {
            context.response.body = { audioSrc: audioFilepath };
        } else {
            context.response.body = { error: 'Audio source not found.' };
        }
    } catch (error) {
        context.response.status = 500;
        context.response.body = { error: error.message };
    }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (context, _next) => {
    await context.send({
      root: `${Deno.cwd()}/public`,
      index: "index.html",
    });
});

app.addEventListener("listen", () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

await app.listen({ port: PORT });
