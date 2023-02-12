// Utility functions used by the bot

// Function to get the shortened subject name
function shortenSubjectName(subjectName) {
  let shortenedName = "";
  subjectName
    .trim()
    .split(" ")
    .forEach((word) => {
      shortenedName = shortenedName.concat(word[0]);
    });
  return shortenedName;
}

// Function to calculate cut
function calculateCut(presentHours, totalHours) {
  const currentPercentage = (presentHours / totalHours) * 100;
  const totalCut = (presentHours * 100) / 75;
  const cut = totalCut - totalHours;
  if (currentPercentage > 75) {
    return Math.floor(cut);
  } else {
    return Math.ceil(cut);
  }
}

// Function to split message if message size is large
function splitMsg(message) {
  const lines = message.split("\n");
  const chunks = [];
  let chunk = "";
  for (const line of lines) {
    if (chunk.split("\n").length >= 50) {
      chunks.push(chunk);
      chunk = "";
    }
    chunk += `${line}\n`;
  }
  if (chunk) {
    chunks.push(chunk);
  }
  return chunks;
}

module.exports = { shortenSubjectName, calculateCut, splitMsg };
