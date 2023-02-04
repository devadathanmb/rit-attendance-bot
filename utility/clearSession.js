// Helper function to clear expired sessions using settimeout

const moment = require("moment");

function clearSession(localSession) {
  const sessions = localSession.DB.get("sessions").valueOf();
  const now = moment();

  sessions.forEach((session) => {
    const id = session.id;
    const createdDate = moment(session.data.created_at);
    const hours = parseInt(moment.duration(now.diff(createdDate)).asHours());

    if (hours >= 1) {
      localSession.DB.removeById(id);
      localSession.saveSession(id, null);
    }
  });
}

module.exports = clearSession;
