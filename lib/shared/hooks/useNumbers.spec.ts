import { fiatFormat } from './useNumbers'

test('Stringifies bigints', () => {
  expect(JSON.stringify(12345n)).toBe('"12345"')
})

test('fiatFormat', () => {
  expect(fiatFormat(0)).toBe('0.00')
  expect(fiatFormat(1)).toBe('1.00')
  expect(fiatFormat(123.456)).toBe('123.46')
  expect(fiatFormat(12345)).toBe('12.35k')
  expect(fiatFormat(12345.6789)).toBe('12.35k')
  expect(fiatFormat(123456789.12345678)).toBe('123.46m')
})
