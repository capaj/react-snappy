/* global jest */
const enzyme = require('enzyme')
const beautify = require('js-beautify')
const fs = require('fs')
const path = require('path')
const chalk = require('chalk')
const printDiff = require('./print-diff')
const removeHtmlComments = require('./remove-html-comments')
const mkdirp = require('mkdirp')
const jsdom = require('jsdom')

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
  const dir = path.dirname(path.relative(process.cwd(), caller))
  const callerPathCleaned = path.relative(dir, caller).replace(/\//g, '-')
  return `${reactComponent.type.name}_${propNames}_${counter}_from_${callerPathCleaned}.html`
}

let snapshotFolder = './snapshots/'

function getHtml (wrapper) {
  const rawHtml = wrapper.html()
  if (!rawHtml) {
    throw new Error(`no render output from component ${reactComponent.type.name}`)  // you don't want to use snapshot testing for components which don't render anything
  }
  const text = removeHtmlComments(rawHtml)

  return beautify.html(text, { indent_size: 2 })
}

const log = (msg) => {
  process.stdout.write(`${msg}\n`)
}

function save (relFolder, snapshotName, html) {
  const snapFolderPath = path.join(relFolder, snapshotFolder)
  mkdirp.sync(snapFolderPath)
  fs.writeFileSync(path.join(snapFolderPath, snapshotName), html)
  log(chalk.green(`${snapshotName} snapshot was successfully saved`))
}

function initJsdom (html = '<html><head></head><body></body></html>') {
  const doc = jsdom.jsdom(html)
  const win = doc.defaultView
  global.document = doc
  global.window = win
}

if (!global.document && !global.window) {
  initJsdom() // if it already is shimmed
}

module.exports = {
  setFolder (folder) {
    snapshotFolder = folder
  },
  setColors: printDiff.setColors,
  resetCounter (path) {
    usageCounts.set(path, 0)
  },
  resetCounters () {
    usageCounts = new Map()
  },
  jsdom: initJsdom,
  check (reactComponent) {
    const wrapper = enzyme.mount(reactComponent)
    const html = getHtml(wrapper)
    const caller = getCallerFile()
    const snapshotName = getSnapshotName(caller, reactComponent)
    const relativePath = path.dirname(path.relative(process.cwd(), caller))
    const snapshotPath = path.join(relativePath, snapshotFolder, snapshotName)
    if (process.env.SNAPPY_SAVE_ALL) {
      save(snapshotFolder, snapshotName, html)
      return wrapper
    }
    const snapshot = fs.readFileSync(snapshotPath, 'utf8')
    const {differences, diffOut} = printDiff.diff(html, snapshot, snapshotPath)
    if (differences > 0) {
      if (typeof jest === 'object') {
        throw new Error(`Snapshot ${snapshotPath} does not match the tested component, there are ${differences} differences:\n` + diffOut)
      } else {
        console.log(diffOut)
        throw new Error(`Snapshot ${snapshotPath} does not match the tested component, there were ${differences} differences`)
      }
    }
    return wrapper
  },
  save (reactComponent) {
    const wrapper = enzyme.mount(reactComponent)
    const html = getHtml(reactComponent)
    const caller = getCallerFile()
    const snapshotName = getSnapshotName(caller, reactComponent)
    const relativeDir = path.dirname(path.relative(process.cwd(), caller))
    save(relativeDir, snapshotName, html)
    return wrapper
  }
}
