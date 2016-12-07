/* eslint-env jest */
import React from 'react'
import Timer from '../test/react-component'
import snappy from '../index'
import fs from 'fs'

it('can save', () => {
  const wrapper = snappy.save(<Timer />)
  snappy.save(<Timer value={5} />)
})
it('can check', () => {
  snappy.resetCounters()
  snappy.check(<Timer />)
  snappy.check(<Timer value={5} />)
})

const LameComponent = (props) => {
  return null
}

it("throws when component doesn't render anything", () => {  // these tests should be written as regular component tests, not as snapshot tests
  expect(() => {
    snappy.save(<LameComponent />)
  }).toThrow('no render output from component LameComponent')
})

it('can set folder', () => {
  snappy.setFolder('./mySpecialSnapshotFolder')
  snappy.save(<Timer />)
  fs.unlinkSync('./test-jest/mySpecialSnapshotFolder/Timer__3_from_react-snappy.spec.js.html')  // clean up after
  fs.rmdirSync('./test-jest/mySpecialSnapshotFolder')
})

afterAll(() => {
  fs.unlinkSync('./test-jest/snapshots/Timer__1_from_react-snappy.spec.js.html')  // clean up after
  fs.unlinkSync('./test-jest/snapshots/Timer_value_2_from_react-snappy.spec.js.html')  // clean up after
})

export default {}
