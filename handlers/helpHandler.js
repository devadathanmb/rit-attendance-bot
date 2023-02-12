// Handle help command

function helpHandler(ctx) {
  const message = `Available commands:

/help - To show the available commands
/login username:password - To login 
/attendance - To view attendance details
/lastupdate - To view last attendance update details
/absent - To view absent dates and details
/present - To view the hours you were present with it's details
`;
  ctx.reply(message, {
    reply_to_message_id: ctx.message.message_id,
  });
}
module.exports = helpHandler;
