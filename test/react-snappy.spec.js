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

test.after(() => {
  fs.unlinkSync('../test/snapshots/Timer__1_from_react-snappy.spec.js.html')  // clean up after
  fs.unlinkSync('../test/snapshots/Timer_value_2_from_react-snappy.spec.js.html')  // clean up after
})

export default {}
