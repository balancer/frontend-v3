import { fiatFormat } from './useNumbers'

test('Stringifies bigints', () => {
  expect(JSON.stringify(12345n)).toBe('"12345"')
})

test('fiatFormat', () => {
  expect(fiatFormat('0.000000000000000001')).toBe('0.00')
  expect(fiatFormat('0.001')).toBe('0.00')
  expect(fiatFormat('0.006')).toBe('0.01')
  expect(fiatFormat('0.012345')).toBe('0.01')
  expect(fiatFormat('0.123456789')).toBe('0.12')
  expect(fiatFormat('0')).toBe('0.00')
  expect(fiatFormat('1')).toBe('1.00')
  expect(fiatFormat('1.234')).toBe('1.23')
  expect(fiatFormat('10')).toBe('10.00')
  expect(fiatFormat('10.1234')).toBe('10.12')
  expect(fiatFormat('100')).toBe('100.00')
  expect(fiatFormat('123.456')).toBe('123.46')
  expect(fiatFormat('12345')).toBe('12.35k')
  expect(fiatFormat('12345.6789')).toBe('12.35k')
  expect(fiatFormat('123456789.12345678')).toBe('123.46m')
})
