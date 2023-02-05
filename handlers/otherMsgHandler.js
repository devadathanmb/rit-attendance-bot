// Handle messages other than commands
const randomQuotes = require("random-quotes");

function otherMsgHandler(ctx) {
  const quote = randomQuotes.default();
  const message = `<i>${quote.body}</i>\n
  - <i>${quote.author}</i>`;
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
