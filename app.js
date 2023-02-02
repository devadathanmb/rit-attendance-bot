require("dotenv").config();
const ngrok = require("ngrok");
const { Telegraf } = require("telegraf");
const LocalSession = require("telegraf-session-local");
const auth = require("./middleware/auth.js");

// Message handlers

const loginHandler = require("./handlers/loginHandler.js");
const startHandler = require("./handlers/startHandler.js");
const helpHandler = require("./handlers/helpHandler.js");
const attendanceHandler = require("./handlers/attendanceHandler.js");
const lastupdateHandler = require("./handlers/lastupdateHandler.js");
const otherMsgHandler = require("./handlers/otherMsgHandler.js");

// Environment variables

const API_TOKEN = process.env.API_TOKEN;
/* const WEB_HOOK_URL = process.env.WEB_HOOK_URL; */
const PORT = process.env.PORT;
const API_URL = process.env.API_URL;

// Configs

/* axios.defaults.withCredentials = true; */

// Bot

const bot = new Telegraf(API_TOKEN);

// Middleware

bot.use(new LocalSession({}).middleware());

// Start

bot.start((ctx) => {
  startHandler(ctx);
});

// Help command
bot.command("help", async (ctx) => {
  helpHandler(ctx);
});

// Login command

bot.command("login", async (ctx) => {
  loginHandler(ctx, API_URL);
});

// Attendance command

bot.command("attendance", auth, async (ctx) => {
  attendanceHandler(ctx);
});

// Last update command

bot.command("/lastupdate", auth, async (ctx) => {
  lastupdateHandler(ctx);
});

// Handle other messages

bot.on("text", async (ctx) => {
  otherMsgHandler(ctx);
});

// Ngrok wrapper for WEB_HOOK_URL

(async function () {
  const WEB_HOOK_URL = await ngrok.connect(8000);
  bot
    .launch({
      webhook: {
        domain: WEB_HOOK_URL,
        port: PORT,
      },
    })
    .then(() => console.log(`🚀 Bot is up and running on port ${PORT}`));
})();
