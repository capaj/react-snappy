const jsdiff = require('diff')
const {indexOfRegex, lastIndexOfRegex} = require('index-of-regex')
const chalk = require('chalk')

let diffToColors = {
  added: chalk.red,
  removed: chalk.green
}

function getColor (part) {
  let color = chalk.gray
  if (part.added) {
    color = diffToColors.added
  }
  if (part.removed) {
    color = diffToColors.removed
  }
  return color
}

function getSign (part) {
  if (part.added) {
    return '+'
  }
  if (part.removed) {
    return '-'
  }
  return ''
}

function setColors (userDiffToColors) {
  diffToColors = userDiffToColors
}

function diff (first, second, snapshotPath) {
  let c = 0
  jsdiff.diffLines(first, second).forEach((part) => {
    if (part.removed || part.added) {
      c++
    }
  })
  let logOutput = ''
  const log = (msg) => {
    logOutput += msg + '\n'
  }
  if (c > 0) {
    if (typeof jest !== 'object') {
      log(chalk.red(`${snapshotPath} is different to render output:`))
    }
    jsdiff.diffLines(first, second).forEach((part) => {
      let printOut = part.value
      if ((!part.removed && !part.added) && part.count > 25) {
        let endingPart = part.value
        endingPart = endingPart.substring(0, lastIndexOfRegex(endingPart, /\r?\n/g) - 1)
        endingPart = endingPart.substring(lastIndexOfRegex(endingPart, /\r?\n/g), part.value.length)

        const hiddenLines = part.count - 2
        // console.log(endingPart)
        const beginningPart = part.value.substring(0, indexOfRegex(part.value, /\r?\n/g))

        log(getColor(part)(beginningPart))
        log(chalk.yellow(`\n <-- hidden ${hiddenLines} unchanged lines --> \n`))
        log(getColor(part)(endingPart))
      } else {
        log(getSign(part) + ' ' + getColor(part)(printOut))
      }
    })
  }
  return {
    differences: c,
    diffOut: logOutput
  }
}

module.exports = {
  setColors,
  diff
}
