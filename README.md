# [Soundsnap](https://www.soundsnap.com/) Audio Source Fetcher

A simple POC (Proof-of-Concept) to fetch audio sources from Soundsnap.

## 🚀 Setup

### Prerequisites
- [Node.js](https://nodejs.org/) and npm installed

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/GooglyBlox/free-soundsnap-audios.git 
    cd free-soundsnap-audios
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Start the development server:**
    ```bash
    npm run dev
    ```

### Deployment

To deploy the project, you can use any Node.js hosting service like [Heroku](https://www.heroku.com/), [Vercel](https://vercel.com/), or [DigitalOcean](https://www.digitalocean.com/). Make sure to set the environment variable `PORT` if needed. For deploying in a serverless environment like Vercel, see the implementation in the `deployment` branch of the project.

## 🎧 Usage

1. **Open your browser and go to `http://localhost:3000`.**
2. **Enter a Soundsnap URL and click "Fetch Audio".**
3. **If the audio source is found, a download link will be provided.**

## ⚠️ Liability

The creators and contributors of this project bear **no responsibility** for any misuse of the tool. Users are solely responsible for their actions and any consequences that arise from the improper use of this application.

## 📜 License

This project is licensed under the [MIT License](LICENSE).