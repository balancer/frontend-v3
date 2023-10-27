import { MockApi } from '@/lib/balancer-api/MockApi'
import { JoinConfigBuilder } from './JoinConfigBuilder'
import { ChainId } from '@balancer/sdk'
import { defaultTestUserAccount } from '@/test/utils/wagmi'

async function getPoolState() {
  const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer Weighted wjAura and WETH
  return await new MockApi().getPool(poolId)
}

const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

test('build Unbalanced Join Config', async () => {
  const poolStateInput = await getPoolState()
  const payload = new JoinConfigBuilder(ChainId.MAINNET, poolStateInput, 'unbalanced')

  payload.setAmountIn('0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f', '1')
  payload.setAmountIn('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', '1')

  const result = await payload.buildSdkJoinTxConfig(defaultTestUserAccount)
  payload.setSlippage('2')

  expect(result.minBptOut).toBeGreaterThan(400000000000000000000n)
})

test('build Unbalanced Join Config with ETH (mainnet native asset)', async () => {
  const poolStateInput = await getPoolState()
  const payload = new JoinConfigBuilder(ChainId.MAINNET, poolStateInput, 'unbalancedNativeAsset')

  // The user chose ETH in the UI but we need to pass WETH in amountsIn
  payload.setAmountIn(wethAddress, '1')

  const result = await payload.buildSdkJoinTxConfig(defaultTestUserAccount)

  expect(result.minBptOut).toBeGreaterThan(400000000000000000000n)
})

test('build Single Asset Join Config', async () => {
  const poolStateInput = await getPoolState()
  const payload = new JoinConfigBuilder(ChainId.MAINNET, poolStateInput, 'singleAsset')

  // We need to rethink this use case when the SDK is ready
  payload.setAmountIn(wethAddress, '1')

  const result = await payload.buildSdkJoinTxConfig(defaultTestUserAccount)

  expect(result.minBptOut).toBeGreaterThanOrEqual(1000000000000000000n)
})
