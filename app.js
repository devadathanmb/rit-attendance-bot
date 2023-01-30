require("dotenv").config();
const ngrok = require("ngrok");
const { Telegraf } = require("telegraf");
const axios = require("axios");
const LocalSession = require("telegraf-session-local");
const Quote = require("inspirational-quotes");
const moment = require("moment");
const utilites = require("./utility/utilities.js");
const auth = require("./middleware/auth.js");

// Environment variables

const API_TOKEN = process.env.API_TOKEN;
/* const WEB_HOOK_URL = process.env.WEB_HOOK_URL; */
const PORT = process.env.PORT;
const API_URL = process.env.API_URL;

// Configs

axios.defaults.withCredentials = true;

// Bot

const bot = new Telegraf(API_TOKEN);

// Middleware

bot.use(new LocalSession({}).middleware());

// Start

bot.start((ctx) => {
  const message = `Hello ${ctx.chat.username}\n
Thanks for using this bot.
This bot can help you keep track of your attendance and maintain that sweet 75%

Send /help to know how to use the bot
`;
  ctx.reply(message);
});

// Help command
bot.command("help", async (ctx) => {
  const message = `Available commands:
/help : To show the available commands
/login username:password : To login 
/attendance : To view attendance details
/lastupdate : To view last attendance update details
`;
  ctx.reply(message, {
    reply_to_message_id: ctx.message.message_id,
  });
});

// Login command

bot.command("login", async (ctx) => {
  try {
    const credentials = ctx.message.text.split(" ")[1];
    const username = credentials.split(":")[0];
    const password = credentials.split(":")[1];
    const requestBody = {
      username: username,
      password: password,
    };

    const response = await axios.post(`${API_URL}/login`, requestBody);
    const cookie = response.data["session-cookie"];
    ctx.session.session_cookie = cookie;
    ctx.session.created_at = moment().format();
    ctx.reply(
      "You are logged in. Now type /attendance to get attendance details.",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  } catch (error) {
    if (error instanceof TypeError) {
      ctx.reply(
        "Invalid format. Please use /login username:password to log in"
      );
    } else if (error instanceof axios.AxiosError) {
      if (error.response.status == 401) {
        ctx.reply("Invalid username or password sir");
      } else if (error.response.status == 440) {
        ctx.reply("Session expired. Please login again.");
      }
    }
  }
});

// Attendance command

bot.command("attendance", auth, async (ctx) => {
  const response = ctx.response;
  let attendance_data = "";
  response.data.subject_attendance.forEach((subject) => {
    attendance_data = attendance_data.concat(
      `${utilites
        .shortenSubjectName(subject.subject_name)
        .padEnd(5)}: ${subject.present_hours.padStart(
        2
      )}/${subject.total_hours.padEnd(2)} ${parseInt(
        subject.percentage.split(" ")[0]
      )
        .toFixed(2)
        .padStart(6)}% cut: ${utilites.calculateCut(
        parseInt(subject.present_hours),
        parseInt(subject.total_hours)
      )}\n`
    );
  });
  const message = `
**ATTENDANCE**

\`\`\`
Name : ${response.data.name}  

Total attendance : ${response.data.total_attendance}

Attendance details :

${attendance_data}
\`\`\`
`;
  ctx.replyWithMarkdownV2(message);
});

// Last update command

bot.command("/lastupdate", auth, async (ctx) => {
  const response = ctx.response;
  let message = "**LASTUPDATE** \n\n```\n";
  const lastUpdateObject = response.data;
  for (subjectCode in lastUpdateObject) {
    message = message.concat(
      `${utilites
        .shortenSubjectName(lastUpdateObject[subjectCode].subject_name)
        .padEnd(5)} : ${lastUpdateObject[subjectCode].last_update.padStart(
        16
      )} \n`
    );
  }
  message = message.concat("```");
  ctx.replyWithMarkdownV2(message, {
    reply_to_message_id: ctx.message.message_id,
  });
});

// Handle other messages

bot.on("text", async (ctx) => {
  const message = `<i>${Quote.getQuote().text}</i>\n
  - <i>${Quote.getQuote().author}</i>`;
  const invalidMsg =
    "That doesn't seem like a valid command. Use /help for available commands";

  ctx
    .replyWithHTML(message, {
      reply_to_message_id: ctx.message.message_id,
    })
    .then(({ message_id }) => {
      setTimeout(() => ctx.deleteMessage(message_id), 1000);
    })
    .then(() => {
      ctx.reply(invalidMsg);
    });
});

// Ngrok wrapper for WEB_HOOK_URL

(async function () {
  const WEB_HOOK_URL = await ngrok.connect(8000);
  console.log(WEB_HOOK_URL);
  bot
    .launch({
      webhook: {
        domain: WEB_HOOK_URL,
        port: PORT,
      },
    })
    .then(() => console.log(`🚀 Bot is up and running on port ${PORT}`));
})();
