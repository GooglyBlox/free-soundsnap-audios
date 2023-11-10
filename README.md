# Free Soundsnap Audios

This repository contains a Node.js application built with Express and Puppeteer. It's designed to extract audio sources from Soundsnap using Puppeteer's headless browser capabilities.

## Prerequisites

Before you begin, ensure you have met the following requirements:
- You have a recent version of Node.js installed (preferably v12 or higher).
- You have npm installed (comes with Node.js).

## Installation

To install the required packages, follow these steps:

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/GooglyBlox/free-soundsnap-audios
   ```
2. Navigate to the cloned repository:
   ```bash
   cd free-soundsnap-audios
   ```
3. Install the necessary Node.js packages:
   ```bash
   npm install
   ```

## Babel Setup
1. Install Babel and its presets:
  ```bash
npm install @babel/core @babel/node @babel/preset-env
  ```
2. Create a ``.babelrc`` file in the project root with the following content:
 ```json
{
  "presets": ["@babel/preset-env"]
}
```

## Running the Application
```bash
npx babel-node index.js
```

## Usage
Once the application is live, simply paste your Soundsnap audio URL into the input box and press Fetch Audio Source. It'll take a few seconds, but it should fetch the audio file for you.
