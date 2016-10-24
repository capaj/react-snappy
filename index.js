const enzyme = require('enzyme')
const beautify = require('js-beautify')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const printDiff = require('./print-diff')

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
  const propNames = Object.keys(reactComponent.props).join('-')
  const callerPathCleaned = path.relative(process.cwd(), caller)
  return `${reactComponent.type.name}_${propNames}_from_${callerPathCleaned}.html`
}

let snapshotFolder = '../test/snapshots/'

module.exports = {
  setFolder: (folder) => {
    snapshotFolder = folder
  },
  check: (reactComponent) => {
    const wrapper = enzyme.mount(reactComponent)
    const html = beautify.html(wrapper.html(), { indent_size: 2 })
    const caller = getCallerFile()
    const snapshotName = getSnapshotName(caller, reactComponent)
    const snapshot = fs.readFileSync(path.join(snapshotFolder, snapshotName), 'utf8')
    const differences = printDiff(html, snapshot)
    if (differences > 0) {
      throw new Error(`Snapshot ${snapshotName} does not match the tested component, there are ${differences} line differences`)
    }
  },
  save: (reactComponent) => {
    const wrapper = enzyme.mount(reactComponent)
    const html = beautify.html(wrapper.html(), { indent_size: 2 })
    const caller = getCallerFile()
    const snapshotName = getSnapshotName(caller, reactComponent)
    fs.writeFileSync(path.join(snapshotFolder, snapshotName), html)
    console.log(chalk.green(`${snapshotName} snapshot was successfully saved`))
  }
}
