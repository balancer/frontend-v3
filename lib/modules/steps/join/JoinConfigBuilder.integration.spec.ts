import { poolId, wETHAddress } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { ChainId } from '@balancer/sdk'
import { someTokenAllowancesMock } from '../../tokens/__mocks__/token.builders'
import { JoinConfigBuilder } from './JoinConfigBuilder'

async function getPoolState() {
  return await new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH
}

test('build Unbalanced Join Config', async () => {
  const poolStateInput = await getPoolState()
  const builder = new JoinConfigBuilder(
    ChainId.MAINNET,
    someTokenAllowancesMock,
    poolStateInput,
    'unbalanced'
  )

  builder.setAmountIn('0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', '1')
  builder.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')

  builder.setSlippage('2')
  const result = await builder.buildSdkJoinTxConfig(defaultTestUserAccount)

  expect(result.minBptOut).toBeGreaterThan(400000000000000000000n)
})

test('build Unbalanced Join Config with ETH (mainnet native asset)', async () => {
  const poolStateInput = await getPoolState()
  const builder = new JoinConfigBuilder(
    ChainId.MAINNET,
    someTokenAllowancesMock,
    poolStateInput,
    'unbalancedNativeAsset'
  )

  // The user chose ETH in the UI but we need to pass WETH in amountsIn
  builder.setAmountIn(wETHAddress, '1')

  const result = await builder.buildSdkJoinTxConfig(defaultTestUserAccount)

  expect(result.minBptOut).toBeGreaterThan(400000000000000000000n)
})

test('build Single Asset Join Config', async () => {
  const poolStateInput = await getPoolState()
  const builder = new JoinConfigBuilder(
    ChainId.MAINNET,
    someTokenAllowancesMock,
    poolStateInput,
    'singleAsset'
  )

  // We need to rethink this use case when the SDK is ready
  builder.setAmountIn(wETHAddress, '1')

  const result = await builder.buildSdkJoinTxConfig(defaultTestUserAccount)

  expect(result.minBptOut).toBeGreaterThanOrEqual(1000000000000000000n)
})
