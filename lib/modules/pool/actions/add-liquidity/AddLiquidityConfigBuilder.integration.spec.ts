import { poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { ChainId } from '@balancer/sdk'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { HumanAmountIn } from './add-liquidity.types'

async function getPoolState() {
  return await new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH
}

test('build Unbalanced Join Config', async () => {
  const poolStateInput = await getPoolState()
  const builder = new AddLiquidityConfigBuilder(ChainId.MAINNET, poolStateInput, 'unbalanced')

  const humanAmountsIn: HumanAmountIn[] = [
    { humanAmount: '1', tokenAddress: wETHAddress },
    { humanAmount: '1', tokenAddress: wjAuraAddress },
  ]

  builder.setSlippage('2')
  const result = await builder.buildSdkAddLiquidityTxConfig(defaultTestUserAccount, humanAmountsIn)

  expect(result.minBptOut.amount).toBeGreaterThan(380000000000000000000n)
})

test('build Unbalanced Join Config with ETH (mainnet native asset)', async () => {
  const poolStateInput = await getPoolState()
  const builder = new AddLiquidityConfigBuilder(
    ChainId.MAINNET,
    poolStateInput,
    'unbalancedNativeAsset'
  )

  // The user chose ETH in the UI but we need to pass WETH in amountsIn
  const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: wETHAddress }]

  const result = await builder.buildSdkAddLiquidityTxConfig(defaultTestUserAccount, humanAmountsIn)

  expect(result.minBptOut.amount).toBeGreaterThan(380000000000000000000n)
})

test('build Single Token AddLiquidity Config', async () => {
  const poolStateInput = await getPoolState()

  const builder = new AddLiquidityConfigBuilder(ChainId.MAINNET, poolStateInput, 'singleToken')

  // We need to rethink this use case when the SDK is ready
  const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: wETHAddress }]

  const result = await builder.buildSdkAddLiquidityTxConfig(defaultTestUserAccount, humanAmountsIn)

  expect(result.minBptOut.amount).toBeGreaterThanOrEqual(1000000000000000000n)
})
