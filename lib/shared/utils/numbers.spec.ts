import { fiatFormat, tokenFormat } from './numbers'

test('Stringifies bigints', () => {
  expect(JSON.stringify(12345n)).toBe('"12345"')
})

describe('fiatFormat', () => {
  test('Abbreviated formats', () => {
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

  test('Non-abbreviated formats', () => {
    expect(fiatFormat('123456789.12345678', { abbreviated: false })).toBe('123,456,789.12')
  })
})

describe('tokenFormat', () => {
  test('Abbreviated formats', () => {
    expect(tokenFormat('0.000000000000000001')).toBe('0')
    expect(tokenFormat('0.001')).toBe('0.001')
    expect(tokenFormat('0.006')).toBe('0.006')
    expect(tokenFormat('0.012345')).toBe('0.0123')
    expect(tokenFormat('0.123456789')).toBe('0.1235')
    expect(tokenFormat('0')).toBe('0')
    expect(tokenFormat('1')).toBe('1')
    expect(tokenFormat('1.234')).toBe('1.234')
    expect(tokenFormat('10')).toBe('10')
    expect(tokenFormat('10.1234')).toBe('10.1234')
    expect(tokenFormat('100')).toBe('100')
    expect(tokenFormat('123.456')).toBe('123.456')
    expect(tokenFormat('12345')).toBe('12.345k')
    expect(tokenFormat('123456789.12345678')).toBe('123.4568m')
  })

  test('Non-abbreviated formats', () => {
    expect(tokenFormat('123456789.12345678', { abbreviated: false })).toBe('123,456,789.1235')
  })
})
