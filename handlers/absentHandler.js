// Handle absent command
const utilites = require("../utility/utilities.js");

function absentHandler(ctx) {
  const response = ctx.response;

  const absentData = response.data;

  let message = "**ABSENT DATA** \n\n```\n";
  let header = `${"DATE".padEnd(16)}  ${"HOUR"}  ${"SUBJECT"}\n\n`;
  message = message.concat(header);

  absentData.forEach((absentObj) => {
    message = message.concat(
      `${absentObj.absent_date}   ${absentObj.absent_hour}     ${utilites
        .shortenSubjectName(absentObj.subject_name)
        .padStart(5)}\n`
    );
  });

  message = message.concat("```");
  ctx.reply("😶 You were absent on the following dates.")
  ctx.replyWithMarkdownV2(message);
}
module.exports = absentHandler;
