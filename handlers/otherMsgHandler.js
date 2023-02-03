// Handle messages other than commands
const Quote = require("inspirational-quotes");

function otherMsgHandler(ctx) {
  const message = `<i>${Quote.getQuote().text}</i>\n
  - <i>${Quote.getQuote().author}</i>`;
  const invalidMsg =
    "🤔 That doesn't seem like a valid command. Use /help for available commands";

  ctx
    .replyWithHTML(message, {
      reply_to_message_id: ctx.message.message_id,
    })
    .then(({ message_id }) => {
      setTimeout(() => ctx.deleteMessage(message_id), 5000);
    })
    .then(() => {
      ctx.reply(invalidMsg);
    });
}

module.exports = otherMsgHandler;
