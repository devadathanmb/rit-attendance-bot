// Function to get the shortened subject name
function shortenSubjectName(subjectName) {
  let shortenedName = ''
  subjectName
    .trim()
    .split(' ')
    .forEach((word) => {
      shortenedName = shortenedName.concat(word[0])
    })
  console.log(shortenedName)
  return shortenedName
}

// Function to calculate cut
function calculateCut(presentHours, totalHours) {
  const currentPercentage = (presentHours / totalHours) * 100
  const totalCut = (presentHours * 100) / 75
  const cut = totalCut - totalHours
  if (currentPercentage > 75) {
    const totalCut = (presentHours * 100) / 75
    const cut = totalCut - totalHours
    return Math.floor(cut)
  } else {
    return Math.ceil(cut)
  }
}

module.exports = { shortenSubjectName, calculateCut }
