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
  }

  const cookie = ctx.session.session_cookie;
  if (!cookie) {
    ctx.reply(
      "🚪You are logged out. Please login to view attendance/lastupdate details. See /help for details"
    );
  } else {
    try {
      const response = await axios.get(`${API_URL}/${ROUTE}`, {
        headers: {
          Cookie: `session_cookie=${cookie};`,
        },
      });
      ctx.response = response;
      next();
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        if (error.response.status == 440) {
          if (ROUTE == "attendance") {
            ctx.reply(
              "⌛Session expired. Please login again to view attendance details."
            );
          } else if (ROUTE == "attendance/lastupdate") {
            ctx.reply(
              "⌛Session expired. Please login again to last update details."
            );
          }
        } else if (error.response.status == 404) {
          ctx.reply("📊 Sorry, it seems like data has not been updated yet.");
        }
      } else {
        console.log(error);
      }
    }
  }
};
