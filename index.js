const enzyme = require('enzyme')
const beautify = require('js-beautify')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const printDiff = require('./print-diff')
const removeHtmlComments = require('./remove-html-comments')

let usageCounts = new Map()

function getCallerFile () {
  var originalFunc = Error.prepareStackTrace
  var callerfile
  try {
    var err = new Error()
    var currentfile

    Error.prepareStackTrace = function (e, stack) { return stack }

    currentfile = err.stack.shift().getFileName()
    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName()
      if (currentfile !== callerfile) break
    }
  } catch (e) {}
  Error.prepareStackTrace = originalFunc
  return callerfile
}

function getSnapshotName (caller, reactComponent) {
  let counter = usageCounts.get(caller)
  if (!counter) {
    counter = 1
  } else {
    counter++
  }
  usageCounts.set(caller, counter)

  const propNames = Object.keys(reactComponent.props).join('-')
  const callerPathCleaned = path.relative(process.cwd(), caller).replace(/\//g, '-')
  return `${reactComponent.type.name}_${propNames}_${counter}_from_${callerPathCleaned}.html`
}

let snapshotFolder = '../test/snapshots/'

function getHtml (reactComponent) {
  const wrapper = enzyme.mount(reactComponent)
  const text = removeHtmlComments(wrapper.html())
  return beautify.html(text, { indent_size: 2 })
}

module.exports = {
  setFolder (folder) {
    snapshotFolder = folder
  },
  resetCounter (path) {
    usageCounts.set(path, 0)
  },
  resetCounters () {
    usageCounts = new Map()
  },
  check (reactComponent) {
    const html = getHtml(reactComponent)
    const caller = getCallerFile()
    const snapshotName = getSnapshotName(caller, reactComponent)
    const snapshotPath = path.join(snapshotFolder, snapshotName)
    const snapshot = fs.readFileSync(snapshotPath, 'utf8')
    const differences = printDiff(html, snapshot, snapshotPath)
    if (differences > 0) {
      throw new Error(`Snapshot ${snapshotName} does not match the tested component, there are ${differences} line differences`)
    }
  },
  save (reactComponent) {
    const html = getHtml(reactComponent)
    const caller = getCallerFile()
    const snapshotName = getSnapshotName(caller, reactComponent)
    fs.writeFileSync(path.join(snapshotFolder, snapshotName), html)
    console.log(chalk.green(`${snapshotName} snapshot was successfully saved`))
  }
}
