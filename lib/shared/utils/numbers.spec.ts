import './numbers'

test('Stringifies bigints', () => {
  expect(JSON.stringify(12345n)).toBe('"12345"')
})
