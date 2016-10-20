const enzyme = require('enzyme')
const beautify = require('js-beautify')
const fs = require('fs')
const expect = require('unexpected')
const path = require('path')

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

module.exports = {
  check: (reactComponent) => {
    const wrapper = enzyme.mount(reactComponent)
    const html = beautify.html(wrapper.html(), { indent_size: 2 })
    const caller = getCallerFile()
    const snapshotName = getSnapshotName(caller, reactComponent)
    const snapshot = fs.readFileSync(path.join('../test/snapshots/', snapshotName), 'utf8')
    expect(html, 'to be', snapshot)
  },
  save: (reactComponent) => {
    const wrapper = enzyme.mount(reactComponent)
    const html = beautify.html(wrapper.html(), { indent_size: 2 })
    const caller = getCallerFile()
    const snapshotName = getSnapshotName(caller, reactComponent)
    fs.writeFileSync(path.join('../test/snapshots/', snapshotName), html)
  }
}
