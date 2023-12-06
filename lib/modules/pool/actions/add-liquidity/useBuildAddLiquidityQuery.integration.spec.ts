import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { DefaultTokenAllowancesTestProvider, testHook } from '@/test/utils/custom-renderers'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { ChainId, TokenAmount } from '@balancer/sdk'
import { waitFor } from '@testing-library/react'

import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { useBuildAddLiquidityQuery } from './useBuildAddLiquidityQuery'
import { someTokenAllowancesMock } from '../../../tokens/__mocks__/token.builders'
import { Address } from 'viem'
import { HumanAmountIn } from './add-liquidity.types'

async function buildQuery() {
  const poolStateInput = await new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH
  return new AddLiquidityConfigBuilder(ChainId.MAINNET, someTokenAllowancesMock, poolStateInput)
}

async function testUseBuildAddLiquidityQuery(humanAmountsIn: HumanAmountIn[], account?: Address) {
  const enabled = true
  const builder = await buildQuery()
  const { result } = testHook(
    () => useBuildAddLiquidityQuery(builder, humanAmountsIn, enabled, account),
    {
      wrapper: DefaultTokenAllowancesTestProvider,
    }
  )
  return result
}

test('fetches join pool config when user is not connected', async () => {
  const account = undefined
  const result = await testUseBuildAddLiquidityQuery([], account)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data).toBeUndefined()
})

test('fetches join pool config when user is connected', async () => {
  const humanAmountsIn: HumanAmountIn[] = [
    { tokenAddress: wETHAddress, humanAmount: '1' },
    { tokenAddress: wjAuraAddress, humanAmount: '1' },
  ]

  const result = await testUseBuildAddLiquidityQuery(humanAmountsIn, defaultTestUserAccount)

  await waitFor(() => expect(result.current.isLoading).toBeFalsy())

  expect(result.current.data?.config).toBeDefined()
  expect(result.current.data?.minBptOut).toBeInstanceOf(TokenAmount)
  // This values will be the same if we keep the block between tests
  expect(result.current.data?.minBptOut.amount).toBeGreaterThan(380000000000000000000n)
})
