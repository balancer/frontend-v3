import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { ChainId, TokenAmount } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { useJoinPoolConfig } from './useAddLiquidityPoolConfig'

async function buildJoinConfig() {
  const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer Weighted wjAura and WETH
  const poolStateInput = await new MockApi().getPool(poolId)
  return new AddLiquidityConfigBuilder(ChainId.MAINNET, poolStateInput)
}

test('fetches join pool config when user is not connected', async () => {
  const builder = await buildJoinConfig()
  const account = undefined
  const { result } = testHook(() => {
    return useJoinPoolConfig(builder, account)
  })

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data).toBeUndefined()
})

test('fetches join pool config when user is connected', async () => {
  const builder = await buildJoinConfig()

  builder.setAmountIn('0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', '1')
  builder.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')

  const account = defaultTestUserAccount
  const { result } = testHook(() => useJoinPoolConfig(builder, account))

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data?.config).toBeDefined()
  expect(result.current.data?.minBptOut).toBeInstanceOf(TokenAmount)
  // This values will be the same if we keep the block between tests
  expect(result.current.data?.minBptOut.amount).toBeGreaterThan(400000000000000000000n)
})
