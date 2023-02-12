// Handle present command
const utilites = require("../utility/utilities.js");

async function presentHandler(ctx) {
  const response = ctx.response;

  const presentData = response.data;

  let message = "";
  let header = `${"DATE".padEnd(16)}  ${"HOUR"}  ${"SUBJECT"}\n\n`;
  message = message.concat(header);

  presentData.forEach((presentObj) => {
    message = message.concat(
      `${presentObj.present_date}   ${presentObj.present_hour}     ${utilites
        .shortenSubjectName(presentObj.subject_name)
        .padStart(5)}\n`
    );
  });

  await ctx.reply("🥳 You were present on the following dates.");
  const chunks = utilites.splitMsg(message);
  for (const chunk of chunks) {
    await ctx.reply(`\`\`\`\n${chunk}\n\`\`\``, { parse_mode: "Markdown" });
  }
}
module.exports = presentHandler;
