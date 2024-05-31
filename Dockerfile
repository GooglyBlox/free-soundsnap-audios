FROM ghcr.io/puppeteer/puppeteer:latest

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/google-chrome-stable

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npx", "babel-node", "index.js"]
