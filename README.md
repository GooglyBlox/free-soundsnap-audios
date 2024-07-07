# [Soundsnap](https://www.soundsnap.com/) Audio Source Fetcher

A simple project to fetch audio sources from Soundsnap without the need for a premium account. It serves as a proof of concept (POC) for accessing Soundsnap audio content.

**Easy to Use**: Simply input the URL of the Soundsnap audio, and the fetcher will retrieve the audio for you.

**Bypass Premium**: This tool allows you to access Soundsnap's audio content without needing a premium account.

## Option 1: Web Application

1. Clone the repository:
    ```bash
    git clone https://github.com/GooglyBlox/free-soundsnap-audios.git 
    cd free-soundsnap-audios
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

4. Open your browser and go to `http://localhost:3000`.
5. In the input box, paste the URL of the Soundsnap audio you want to download. The URL should start with `https://www.soundsnap.com/`.
6. Click the `Fetch Audio` button to process the link.
7. If the audio source is found, a download link will be provided.

## Option 2: Userscript

Alternatively, you can use the Soundsnap Audio Source Fetcher as a userscript. This allows you to automatically fetch and download the audio directly on the Soundsnap page.

[![Install Userscript](https://img.shields.io/badge/Install-Userscript-green?style=for-the-badge)](https://raw.githubusercontent.com/GooglyBlox/free-soundsnap-audios/main/userscript/soundsnap-audio-downloader.user.js)

1. Install a userscript manager extension like [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) or [Violentmonkey](https://chromewebstore.google.com/detail/violentmonkey/jinjaccalgkegednnccohejagnlnfdag) in your browser.
2. Click on the "Install Userscript" button above to install the userscript.
3. Navigate to any Soundsnap page (including sound effects and stock music pages), and the userscript will automatically modify the download buttons to fetch the audio through the API.

## Usage with Userscript

1. Go to any Soundsnap page with audio content.
2. The download buttons will be modified by the userscript.
3. Click on a download button to trigger the download through the API.
4. The audio will be downloaded directly to your device.

## Deployment

To deploy the web application, you can use any Node.js hosting service like [Heroku](https://www.heroku.com/), [Vercel](https://vercel.com/), or [DigitalOcean](https://www.digitalocean.com/). Make sure to set the environment variable `PORT` if needed. For deploying in a serverless environment like Vercel, see the implementation in the `deployment` branch of the project.


## Disclaimer

This application is a proof of concept and is intended for educational purposes only. It demonstrates the technical possibility of accessing web content and should not be used to infringe on the rights of Soundsnap or any other service. 

Please note that this tool should be used responsibly and within the confines of legal and ethical boundaries. The creators and contributors of this project bear **no responsibility** for any misuse of the tool. Users are solely responsible for their actions and any consequences that arise from the improper use of this application.

## License

This project is licensed under the MIT License.
