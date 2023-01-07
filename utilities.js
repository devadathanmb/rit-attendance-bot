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

module.exports = { shortenSubjectName }
