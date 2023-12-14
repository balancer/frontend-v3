import { fNum } from './numbers'

test('Stringifies bigints', () => {
  expect(JSON.stringify(12345n)).toBe('"12345"')
})

describe('fiatFormat', () => {
  test('Abbreviated formats', () => {
    expect(fNum('fiat', '0.000000000000000001')).toBe('0.00')
    expect(fNum('fiat', '0.001')).toBe('0.00')
    expect(fNum('fiat', '0.006')).toBe('0.01')
    expect(fNum('fiat', '0.012345')).toBe('0.01')
    expect(fNum('fiat', '0.123456789')).toBe('0.12')
    expect(fNum('fiat', '0')).toBe('0.00')
    expect(fNum('fiat', '1')).toBe('1.00')
    expect(fNum('fiat', '1.234')).toBe('1.23')
    expect(fNum('fiat', '10')).toBe('10.00')
    expect(fNum('fiat', '10.1234')).toBe('10.12')
    expect(fNum('fiat', '100')).toBe('100.00')
    expect(fNum('fiat', '123.456')).toBe('123.46')
    expect(fNum('fiat', '12345')).toBe('12.35k')
    expect(fNum('fiat', '12345.6789')).toBe('12.35k')
    expect(fNum('fiat', '123456789.12345678')).toBe('123.46m')
  })

  test('Non-abbreviated formats', () => {
    expect(fNum('fiat', '123456789.12345678', { abbreviated: false })).toBe('123,456,789.12')
  })
})

describe('tokenFormat', () => {
  test('Abbreviated formats', () => {
    expect(fNum('token', '0.000000000000000001')).toBe('0')
    expect(fNum('token', '0.001')).toBe('0.001')
    expect(fNum('token', '0.006')).toBe('0.006')
    expect(fNum('token', '0.012345')).toBe('0.0123')
    expect(fNum('token', '0.123456789')).toBe('0.1235')
    expect(fNum('token', '0')).toBe('0')
    expect(fNum('token', '1')).toBe('1')
    expect(fNum('token', '1.234')).toBe('1.234')
    expect(fNum('token', '10')).toBe('10')
    expect(fNum('token', '10.1234')).toBe('10.1234')
    expect(fNum('token', '100')).toBe('100')
    expect(fNum('token', '123.456')).toBe('123.456')
    expect(fNum('token', '12345')).toBe('12.345k')
    expect(fNum('token', '123456789.12345678')).toBe('123.4568m')
  })

  test('Non-abbreviated formats', () => {
    expect(fNum('token', '123456789.12345678', { abbreviated: false })).toBe('123,456,789.1235')
  })
})
