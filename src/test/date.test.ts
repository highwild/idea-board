import { expect, test } from '@jest/globals'
import getDate from '../utils/getDate'

// 01:21 AM Nov 13 2022, UTC
const testTimestamp = 1668302461352

// the formatter reads the machine's own clock, so the expectation is built the
// same way rather than pinned to whichever timezone the test happens to run in
const local = new Date(testTimestamp)
const pad = (value: number) => (value < 10 ? `0${value}` : `${value}`)

test('the inputted timestamp gets formatted into DD/MM/YYYY HH:MM format', () => {
  expect(getDate(testTimestamp)).toBe(
    `${pad(local.getDate())}/${pad(local.getMonth() + 1)}/${local.getFullYear()} ${pad(
      local.getHours()
    )}:${pad(local.getMinutes())}`
  )
})

test('single-digit days, months and times are zero padded so the column lines up', () => {
  const padded = getDate(new Date(2026, 0, 4, 9, 5).getTime())
  expect(padded).toBe('04/01/2026 09:05')
})
