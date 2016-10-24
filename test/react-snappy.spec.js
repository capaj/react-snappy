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
})

test('can check', t => {
  snappy.check(<Timer />)
})

test.after(() => {
  fs.unlinkSync('../test/snapshots/Timer__from_react-snappy.spec.js.html')  // clean up after
})

export default {}
