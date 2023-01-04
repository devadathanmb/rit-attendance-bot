require('dotenv').config()
const { Telegraf } = require('telegraf')
const axios = require('axios')
const LocalSession = require('telegraf-session-local')

const API_TOKEN = process.env.API_TOKEN
const SERVER_URL = process.env.SERVER_URL
const PORT = process.env.PORT
const API_URL = process.env.API_URL

axios.defaults.withCredentials = true

const bot = new Telegraf(API_TOKEN)
bot.use(new LocalSession({ database: 'session_log.json' }).middleware())

bot.command('help', (ctx) => ctx.reply('I will help you'))

bot.command('login', async (ctx) => {
  console.log('/login')
  const credentials = ctx.message.text.split(' ')[1]
  const username = credentials.split(':')[0]
  const password = credentials.split(':')[1]
  const requestBody = {
    username: username,
    password: password,
  }

  try {
    const response = await axios.post(`${API_URL}/login`, requestBody)
    const cookie = response.data['session-cookie']
    ctx.session.session_cookie = cookie
    ctx.reply(
      'You are logged in. Now type /attendance to get attendance details.'
    )
  } catch (error) {
    if (error.response.status == 401) {
      ctx.reply('Invalid username or password sir')
    } else if (error.response.status == 440) {
      ctx.reply('Session expired. Please login again.')
    }
  }
})

bot.command('attendance', async (ctx) => {
  console.log("/attendance")
  const cookie = ctx.session.session_cookie
  const response = await axios.get(`${API_URL}/attendance`, {
    headers: {
      Cookie: `session_cookie=${cookie};`,
    },
  })
  response.data.subject_attendance.forEach(subject => {
    `${subject.subject_name} (${subject.subject_code}): ${subject.present_hours}/${subject.total_hours} ${subject.present_hours}`
  });
  const message = `
Name : ${response.data.name}  
Admission no : ${response.data.admission_no}
Total attendance : ${response.data.total_attendance}
`
  message.replace('.', '\\.')
  ctx.reply(message)
})

// Start webhook via launch method (preferred)
bot.launch({
  webhook: {
    // Public domain for webhook; e.g.: example.com
    domain: SERVER_URL,

    // Port to listen on; e.g.: 8080
    port: PORT,
  },
})
