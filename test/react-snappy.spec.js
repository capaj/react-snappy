import test from 'ava'
import React from 'react'
import Timer from './react-component'
import snappy from '../index'
import jsdom from 'jsdom'
import fs from 'fs'

const doc = jsdom.jsdom('<html><head></head><body></body></html>')
const win = doc.defaultView
global.document = doc
global.window = win

test('can save', t => {
  snappy.save(<Timer />)
  snappy.save(<Timer value={5} />)
})
test('can check', t => {
  snappy.resetCounters()
  snappy.check(<Timer />)
  snappy.check(<Timer value={5} />)
})

const LameComponent = (props) => {
  return null
}

test("throws when component doesn't render anything", (t) => {  // these tests should be written as regular component tests, not as snapshot tests
  t.throws(() => {
    snappy.save(<LameComponent />)
  }, 'no render output from component LameComponent')
})

test('can set folder', () => {
  snappy.setFolder('./mySpecialSnapshotFolder')
  snappy.save(<Timer />)
  fs.unlinkSync('./mySpecialSnapshotFolder/Timer__3_from_react-snappy.spec.js.html')  // clean up after
  fs.rmdirSync('./mySpecialSnapshotFolder')
})

test.after(() => {
  fs.unlinkSync('./snapshots/Timer__1_from_react-snappy.spec.js.html')  // clean up after
  fs.unlinkSync('./snapshots/Timer_value_2_from_react-snappy.spec.js.html')  // clean up after
})

export default {}
