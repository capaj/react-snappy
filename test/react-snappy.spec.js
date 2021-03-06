import test from 'ava'
import React from 'react'
import Timer from './react-component'
import snappy from '../index'
import fs from 'fs'

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
  fs.unlinkSync('./test/mySpecialSnapshotFolder/Timer__3_from_react-snappy.spec.js.html')  // clean up after
  fs.rmdirSync('./test/mySpecialSnapshotFolder')
})

test.after(() => {
  fs.unlinkSync('./test/snapshots/Timer__1_from_react-snappy.spec.js.html')  // clean up after
  fs.unlinkSync('./test/snapshots/Timer_value_2_from_react-snappy.spec.js.html')  // clean up after
})

export default {}
