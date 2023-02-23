// Middleware to authenticate user
const axios = require("axios");

const API_URL = process.env.API_URL;

module.exports = async (ctx, next) => {
  const command = ctx.message.text.split("/")[1];
  let ROUTE;
  if (command == "attendance") {
    ROUTE = "attendance";
  } else if (command == "lastupdate") {
    ROUTE = "attendance/lastupdate";
  } else if (command == "absent") {
    ROUTE = "attendance/absent";
  } else if (command == "present") {
    ROUTE = "attendance/present";
  }

  const cookie = ctx.session.session_cookie;
  if (!cookie) {
    ctx.reply(
      "🚪You are logged out. Please login to view attendance/lastupdate/absent/present details. See /help for details"
    );
  } else {
    try {
      const { message_id: messageID } = await ctx.replyWithHTML(
        "<i><b>🧘  Patience is the key to success</b></i>"
      );
      const response = await axios.get(`${API_URL}/${ROUTE}`, {
        headers: {
          Cookie: `session_cookie=${cookie};`,
        },
      });
      ctx.deleteMessage(messageID);
      ctx.response = response;
      next();
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response.status == 440) {
          ctx.reply(
            "⌛Session expired. Please login again to view attendance details."
          );
        }
      } else if (error.response.status == 404) {
        if (ROUTE == "attendance/absent" && error.data == "No absent hours") {
          ctx.reply(
            "Seems like you were never absent or the data hasn't been updated yet. Please check /lastupdate to ensure."
          );
        } else if (
          ROUTE == "attendance/present" &&
          error.data == "No present hours"
        ) {
          ctx.reply(
            "Seems like you were never present for any hours or the data hasn't been updated yet. Please check /lastupdate to ensure."
          );
        } else {
          ctx.reply("📊 Sorry, it seems like data has not been updated yet.");
        }
      } else if (error.response.status >= 500) {
        ctx.reply(
          "🤔 Seems like there's some issue with RIT Soft. Please try again later."
        );
      } else {
        console.log(error);
      }
    }
  }
};
