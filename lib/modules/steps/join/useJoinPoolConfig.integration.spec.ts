import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { ChainId } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'
import { someTokenAllowancesMock } from '../../tokens/__mocks__/token.builders'
import { JoinConfigBuilder } from './JoinConfigBuilder'
import { useJoinPoolConfig } from './useJoinPoolConfig'

async function buildJoinConfig() {
  const poolStateInput = await new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH
  return new JoinConfigBuilder(ChainId.MAINNET, someTokenAllowancesMock, poolStateInput)
}
const enabled = true

test('fetches join pool config when user is not connected', async () => {
  const builder = await buildJoinConfig()
  const account = undefined
  const { result } = testHook(() => {
    return useJoinPoolConfig(builder, enabled, account)
  })

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data).toBeUndefined()
})

test('fetches join pool config when user is connected', async () => {
  const builder = await buildJoinConfig()

  builder.setAmountIn(wETHAddress, '1')
  builder.setAmountIn(wjAuraAddress, '1')

  const account = defaultTestUserAccount
  const { result } = testHook(() => useJoinPoolConfig(builder, enabled, account))

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data?.config).toBeDefined()
  // This values will be the same if we keep the block between tests
  expect(result.current.data?.minBptOut).toBeGreaterThan(400000000000000000000n)
})
