# Free [Soundsnap](https://www.soundsnap.com/) Audios

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

### Babel Setup
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
Once the application is live, simply paste your Soundsnap audio URL into the input box and press Fetch Audio. It'll take a few seconds, but it should fetch the audio file for you.


## :warning: Important Disclaimer

This GitHub repository and the associated Node.js application are **strictly for educational purposes**. The project demonstrates the use of Puppeteer with Express in Node.js for web scraping and automation tasks.

### Intended Use

The purpose of this project is to showcase programming techniques and the potential of web automation. It serves as a learning resource for those interested in Node.js, Puppeteer, and web scraping technologies.

### Prohibited Use

:exclamation: **This project is NOT intended for any form of abuse, unauthorized data extraction, or circumventing any form of content protection or paywalls on websites like Soundsnap.**

The users of this project should adhere to the following guidelines:

- **Respect Legal Boundaries**: Always comply with the terms of service of any website you interact with using this tool.
- **Ethical Usage**: Use the project for learning and enhancing your programming skills without infringing on the rights of others or engaging in unethical behavior.
- **No Commercial Use**: This project should not be used for commercial purposes or to gain unauthorized access to protected content.

### Liability

The creators and contributors of this project bear **no responsibility** for any misuse of the tool. Users are solely responsible for their actions and any consequences that arise from the improper use of this application.

---

By using or contributing to this project, you agree to abide by these terms and conditions. Failure to adhere to these guidelines may result in legal action and/or removal from accessing the project.

_This notice is a proactive step to promote responsible use and ethical behavior in the tech community._
