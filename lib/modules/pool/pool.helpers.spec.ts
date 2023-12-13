import { poolId } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { toPoolStateInput } from './pool.helpers'

test('gets pool state input from pool', () => {
  const wjAuraWethPoolMock = new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH
  const pool = aWjAuraWethPoolElementMock()

  const poolInputState = toPoolStateInput(pool)
  expect(poolInputState.address).toBe(wjAuraWethPoolMock.address)
  expect(poolInputState.id).toBe(wjAuraWethPoolMock.id)
  // expect(poolInputState.tokens).toEqual(expect.objectContaining(wjAuraWethPoolMock.tokens))
})
