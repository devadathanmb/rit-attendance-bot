// Cronjob file to clear out expired logins from sessions.json

const LocalSession = require("telegraf-session-local");
const moment = require("moment");
const cron = require("node-cron");

const localSession = new LocalSession({
  database: "../sessions.json",
});

cron.schedule("*/10 * * * * *", () => {
  console.log("Cron running");
  const sessions = localSession.DB.value().sessions;
  for (const session of sessions) {
    console.log(session);
    const id = session.id;
    const createdDate = moment(session.data.created_at);
    const now = moment();
    const hours = parseInt(moment.duration(now.diff(createdDate)).asHours());

    if (hours > 1) {
      console.log("Removing");
      localSession.DB.removeById(id);
    }
  }
  localSession.DB.write();
});
