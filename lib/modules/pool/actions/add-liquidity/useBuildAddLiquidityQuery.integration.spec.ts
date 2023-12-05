import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { ChainId, TokenAmount } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'

import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { useBuildAddLiquidityQuery } from './useBuildAddLiquidityQuery'
import { someTokenAllowancesMock } from '../../../tokens/__mocks__/token.builders'

async function buildQuery() {
  const poolStateInput = await new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH
  return new AddLiquidityConfigBuilder(ChainId.MAINNET, someTokenAllowancesMock, poolStateInput)
}
const enabled = true

test('fetches join pool config when user is not connected', async () => {
  const builder = await buildQuery()
  const account = undefined
  const { result } = testHook(() => {
    return useBuildAddLiquidityQuery(builder, enabled, account)
  })

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data).toBeUndefined()
})

test('fetches join pool config when user is connected', async () => {
  const builder = await buildQuery()

  builder.setAmountIn(wETHAddress, '1')
  builder.setAmountIn(wjAuraAddress, '1')

  const account = defaultTestUserAccount
  const { result } = testHook(() => useBuildAddLiquidityQuery(builder, enabled, account))

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data?.config).toBeDefined()
  expect(result.current.data?.minBptOut).toBeInstanceOf(TokenAmount)
  // This values will be the same if we keep the block between tests
  expect(result.current.data?.minBptOut.amount).toBeGreaterThan(390000000000000000000n)
})
