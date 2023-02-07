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

// Helper function to clear expired sessions
const clearSession = require("./utility/clearSession.js");

// Environment variables

const BOT_TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT;
const API_URL = process.env.API_URL;
const NGROK_TOKEN = process.env.NGROK_TOKEN;

// Bot

const bot = new Telegraf(BOT_TOKEN);

// Middleware

const localSession = new LocalSession({});
bot.use(localSession.middleware());

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
  await loginHandler(ctx, API_URL);
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

bot.on("message", async (ctx) => {
  otherMsgHandler(ctx);
});

// Clear expired sessions after an hour

setInterval(() => clearSession(localSession), 3600000);

// Ngrok wrapper for WEB_HOOK_URL

(async function () {
  const WEB_HOOK_URL = await ngrok.connect({ addr: 8000 });
  bot
    .launch({
      webhook: {
        domain: WEB_HOOK_URL,
        port: PORT,
      },
    })
    .then(() => console.log(`🚀 Bot is up and running on port ${PORT}`));
})();
