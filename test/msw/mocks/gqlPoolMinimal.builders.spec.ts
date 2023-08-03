import { aGqlPoolMinimal, anApr } from './gqlPoolMinimal.builders'

test('Builders are implicitly tested by the tests using them but this is for debugging when build edge cases', () => {
  expect(aGqlPoolMinimal({ address: 'foobar' }).address).toBe('foobar')
  expect(anApr().apr).toEqual({
    total: '0.005628271838682321',
  })
})
