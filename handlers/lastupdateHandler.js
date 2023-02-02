// Handle lastupdate command

const utilites = require("../utility/utilities.js");

function lastupdateHandler(ctx) {
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
}
module.exports = lastupdateHandler;
