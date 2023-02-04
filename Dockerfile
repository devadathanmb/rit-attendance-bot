FROM node:19-slim
WORKDIR /bot
COPY package.json /bot
COPY package-lock.json /bot
RUN npm install
COPY . /bot
CMD ["node", "app.js"]
