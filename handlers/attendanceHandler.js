// Handle attendance command
const utilites = require("../utility/utilities.js");

function attendanceHandler(ctx) {
  const response = ctx.response;
  let attendance_data = "";
  response.data.subject_attendance.forEach((subject) => {
    attendance_data = attendance_data.concat(
      `${utilites
        .shortenSubjectName(subject.subject_name)
        .padEnd(5)}: ${subject.present_hours.padStart(
        2
      )}/${subject.total_hours.padEnd(2)} ${parseInt(
        subject.percentage.split(" ")[0]
      )
        .toFixed(2)
        .padStart(6)}% cut: ${utilites.calculateCut(
        parseInt(subject.present_hours),
        parseInt(subject.total_hours)
      )}\n`
    );
  });
  const message = `
**ATTENDANCE**

\`\`\`
Name : ${response.data.name}  

Total attendance : ${response.data.total_attendance}

Attendance details :

${attendance_data}
\`\`\`
`;
  ctx.replyWithMarkdownV2(message);
}
module.exports = attendanceHandler;
