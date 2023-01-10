// Middleware to authenticate user
const axios = require('axios')

const API_URL = process.env.API_URL

module.exports = async (ctx, next) => {
  const cookie = ctx.session.session_cookie
  if (!cookie) {
    ctx.reply(
      'You are logged out. Please login to view attendance details. See /help for details'
    )
  } else {
    try {
      const response = await axios.get(`${API_URL}/attendance`, {
        headers: {
          Cookie: `session_cookie=${cookie};`,
        },
      })
      ctx.response = response
      next()
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        ctx.reply(
          'Session expired. Please login again to view last update details.'
        )
      } else {
        console.log(error)
      }
    }
  }
}
