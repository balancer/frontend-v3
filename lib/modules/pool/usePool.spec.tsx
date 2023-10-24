import { Wrapper, testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { PoolProvider, _usePool, usePool } from './usePool'
import { GqlChain } from '@/lib/services/api/generated/graphql'
import { defaultPoolMock } from '@/test/msw/handlers/Pool.handlers'
import { PoolVariant } from './pool.types'

test('fetches v2 pool', async () => {
  const poolId = 'test pool id'

  const { result } = testHook(() =>
    _usePool({ id: poolId, chain: GqlChain.Mainnet, variant: PoolVariant.v2 })
  )

  await waitFor(() => expect(result.current.loading).toBeFalsy())

  expect(result.current.pool).toMatchObject(defaultPoolMock)
})

// Remove skip to check that it throws
test.skip('fetches v2 pool without PoolProvider in wrapper', () => {
  testHook(() => usePool()) // Throws Error: usePool must be used within a PoolProvider context
})

test('fetches v2 pool without exposing _usePool', async () => {
  const wrapper: Wrapper = ({ children }) => (
    <PoolProvider id="test pool id" chain={GqlChain.Mainnet} variant={PoolVariant.v2}>
      {children}
    </PoolProvider>
  )

  const { result } = testHook(() => usePool(), { wrapper })
  await waitFor(() => expect(result.current.loading).toBeFalsy())

  expect(result.current.pool).toMatchObject(defaultPoolMock)
})
