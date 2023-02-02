function startHandler(ctx) {
  const message = `Hello ${ctx.chat.username}\n
Thanks for using this bot.
This bot can help you keep track of your attendance and maintain that sweet 75%

Send /help to know how to use the bot
`;
  ctx.reply(message);
}
module.exports = startHandler;
