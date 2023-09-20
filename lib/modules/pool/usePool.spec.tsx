import { Wrapper, renderHookWithDefaultProviders } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { PoolProvider, _usePool, usePool } from './usePool'
import { GqlChain } from '@/lib/services/api/generated/graphql'
import { defaultPool } from '@/test/msw/mocks/Pool.handlers'

test('fetches v2 pool', async () => {
  const poolId = 'test pool id'

  const { result } = renderHookWithDefaultProviders(() =>
    _usePool({ id: poolId, chain: GqlChain.Mainnet, variant: 'v2' })
  )

  await waitFor(() => expect(result.current.loading).toBeFalsy())

  expect(result.current.pool).toMatchObject(defaultPool)
})

// Remove skip to check that it throws
test.skip('fetches v2 pool without PoolProvider in wrapper', () => {
  renderHookWithDefaultProviders(() => usePool()) // Throws Error: usePool must be used within a PoolProvider context
})

test('fetches v2 pool without exposing _usePool', async () => {
  const wrapper: Wrapper = ({ children }) => (
    <PoolProvider id="test pool id" chain={GqlChain.Mainnet} variant="v2">
      {children}
    </PoolProvider>
  )

  const { result } = renderHookWithDefaultProviders(() => usePool(), { wrapper })
  await waitFor(() => expect(result.current.loading).toBeFalsy())

  expect(result.current.pool).toMatchObject(defaultPool)
})
