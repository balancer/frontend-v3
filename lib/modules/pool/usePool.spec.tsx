import { GetPoolQuery, GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { defaultPoolMock, defaultPoolResponseMock } from '@/test/msw/handlers/Pool.handlers'
import { testHook } from '@/test/utils/custom-renderers'
import { waitFor } from '@testing-library/react'
import { PoolVariant } from './pool.types'
import { _usePool } from './usePool'
import { defaultGaugeAddressMock } from '@/test/msw/builders/gqlStaking.builders'

async function testUsePool({
  initialData = defaultPoolResponseMock,
}: {
  initialData?: GetPoolQuery
} = {}) {
  const { result } = testHook(() => {
    return _usePool({
      id: poolId,
      chain: GqlChain.Mainnet,
      variant: PoolVariant.v2,
      initialData,
    })
  })

  await waitFor(() => expect(result.current.pool).toBeDefined())
  return result
}

const poolId = 'test pool id'
test('fetches v2 pool', async () => {
  const result = await testUsePool()
  expect(result.current.pool).toMatchObject(defaultPoolMock)
})

describe('Gql pool helpers', () => {
  test('returns pool explorer link', async () => {
    const result = await testUsePool()

    expect(result.current.poolExplorerLink).toBe(
      'https://etherscan.io/address/0x5c6ee304399dbdb9c8ef030ab642b10820db8f56'
    )
  })

  test('returns gauge explorer link when the pool', async () => {
    const result = await testUsePool()

    expect(result.current.gaugeExplorerLink).toBe(
      `https://etherscan.io/address/0x-test-gauge-address`
    )
  })

  test('knows if there is gauge', async () => {
    const result = await testUsePool()

    expect(result.current.hasGaugeAddress).toBeTruthy()
    expect(result.current.gaugeAddress).toBe(defaultGaugeAddressMock)
  })
})
