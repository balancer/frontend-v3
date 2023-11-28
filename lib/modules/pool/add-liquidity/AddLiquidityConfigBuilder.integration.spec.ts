import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { ChainId } from '@balancer/sdk'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { someTokenAllowancesMock } from '../../tokens/__mocks__/token.builders'

async function getPoolState() {
  return await new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH
}

test('build Unbalanced Join Config', async () => {
  const poolStateInput = await getPoolState()
  const builder = new AddLiquidityConfigBuilder(
    ChainId.MAINNET,
    someTokenAllowancesMock,
    poolStateInput,
    'unbalanced'
  )

  builder.setAmountIn(wETHAddress, '1')
  builder.setAmountIn(wjAuraAddress, '1')

  builder.setSlippage('2')
  const result = await builder.buildSdkAddLiquidityTxConfig(defaultTestUserAccount)

  expect(result.minBptOut.amount).toBeGreaterThan(400000000000000000000n)
})

test('build Unbalanced Join Config with ETH (mainnet native asset)', async () => {
  const poolStateInput = await getPoolState()
  const builder = new AddLiquidityConfigBuilder(
    ChainId.MAINNET,
    someTokenAllowancesMock,
    poolStateInput,
    'unbalancedNativeAsset'
  )

  // The user chose ETH in the UI but we need to pass WETH in amountsIn
  builder.setAmountIn(wETHAddress, '1')

  const result = await builder.buildSdkAddLiquidityTxConfig(defaultTestUserAccount)

  expect(result.minBptOut.amount).toBeGreaterThan(400000000000000000000n)
})

test('build Single Token AddLiquidity Config', async () => {
  const poolStateInput = await getPoolState()

  const builder = new AddLiquidityConfigBuilder(
    ChainId.MAINNET,
    someTokenAllowancesMock,
    poolStateInput,
    'singleToken'
  )

  // We need to rethink this use case when the SDK is ready
  builder.setAmountIn(wETHAddress, '1')

  const result = await builder.buildSdkAddLiquidityTxConfig(defaultTestUserAccount)

  expect(result.minBptOut.amount).toBeGreaterThanOrEqual(1000000000000000000n)
})
