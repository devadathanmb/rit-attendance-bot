// Hanlde login command

const moment = require("moment");
const axios = require("axios");

async function loginHandler(ctx, API_URL) {
  try {
    const credentials = ctx.message.text.split(" ")[1];
    const username = credentials.split(":")[0];
    const password = credentials.split(":")[1];

    if (!username || !password) {
      throw new TypeError("🔑 Missing username or password");
    }

    const requestBody = {
      username: username,
      password: password,
    };

    const response = await axios.post(`${API_URL}/login`, requestBody);
    const cookie = response.data["session-cookie"];
    ctx.session.session_cookie = cookie;
    ctx.session.created_at = moment().format();
    ctx.reply(
      "😎 You are logged in. Now type /attendance to get attendance details.",
      {
        reply_to_message_id: ctx.message.message_id,
      }
    );
  } catch (error) {
    if (error instanceof TypeError) {
      ctx.reply(
        "📰 Invalid format. Please use /login username:password to log in"
      );
    } else if (error instanceof axios.AxiosError) {
      if (error.response.status == 401) {
        ctx.reply("❌ Invalid username or password.");
      } else if (error.response.status == 440) {
        ctx.reply("⌛ Session expired. Please login again.");
      }
    } else {
      console.log(error);
    }
  }
}
module.exports = loginHandler;
