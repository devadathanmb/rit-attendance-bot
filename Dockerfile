FROM node:19-slim
WORKDIR /bot
COPY package.json /bot
COPY package-lock.json /bot
RUN npm install
COPY . /bot
RUN echo "* * */1 * * * node /bot/cron/terminateSessions.js" >> /etc/crontab
CMD ["node", "app.js"]
