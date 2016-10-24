const jsdiff = require('diff')
const {indexOfRegex, lastIndexOfRegex} = require('index-of-regex')
const chalk = require('chalk')

function getColor (part) {
  let color = chalk.gray
  if (part.added) {
    color = chalk.red
  }
  if (part.removed) {
    color = chalk.green
  }
  return color
}

function diff (first, second, snapshotPath) {
  let c = 0
  jsdiff.diffLines(first, second).forEach((part) => {
    if (part.removed || part.added) {
      c++
    }
  })
  if (c > 0) {
    console.error(chalk.red(`${snapshotPath} is different to render output:`))
    jsdiff.diffLines(first, second).forEach((part) => {
      let printOut = part.value
      if ((!part.removed && !part.added) && part.count > 25) {
        let endingPart = part.value
        endingPart = endingPart.substring(0, lastIndexOfRegex(endingPart, /\r?\n/g) - 1)
        endingPart = endingPart.substring(lastIndexOfRegex(endingPart, /\r?\n/g), part.value.length)

        const hiddenLines = part.count - 2
        // console.log(endingPart)
        const beginningPart = part.value.substring(0, indexOfRegex(part.value, /\r?\n/g))

        console.log(getColor(part)(beginningPart))
        console.log(chalk.yellow(`\n <-- hidden ${hiddenLines} unchanged lines --> \n`))
        console.log(getColor(part)(endingPart))
      } else {
        console.log(getColor(part)(printOut))
      }
    })
  }
  return c
}

module.exports = diff
