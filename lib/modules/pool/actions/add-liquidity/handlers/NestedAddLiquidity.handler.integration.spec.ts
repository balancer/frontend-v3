/* eslint-disable max-len */
import networkConfig from '@/lib/config/networks/mainnet'
import { daiAddress, usdcAddress, usdtAddress, wETHAddress } from '@/lib/debug-helpers'
import { testPublicClient } from '@/test/utils/wagmi/wagmi-test-setup'
import { nestedPoolMock } from '../../../__mocks__/nestedPoolMock'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { NestedAddLiquidityHandler } from './NestedAddLiquidity.handler'
import { selectAddLiquidityHandler } from './selectAddLiquidityHandler'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'

function selectNestedHandler(pool: Pool) {
  return selectAddLiquidityHandler(pool) as NestedAddLiquidityHandler
}

describe('When adding nested liquidity for a weighted pool', () => {
  test('has zero price impact', async () => {
    const handler = selectNestedHandler(nestedPoolMock)

    const priceImpact = await handler.getPriceImpact()
    expect(priceImpact).toBe(0)
  })

  test('with single token input', async () => {
    const handler = selectNestedHandler(nestedPoolMock)

    const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: daiAddress }]

    const result = await handler.simulate(humanAmountsIn)

    expect(result.bptOut.amount).toBeGreaterThan(20000000000000000n)
  })

  test('with multiple token input', async () => {
    const handler = selectNestedHandler(nestedPoolMock)

    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: daiAddress },
      { humanAmount: '1', tokenAddress: usdcAddress },
      { humanAmount: '1', tokenAddress: usdtAddress },
    ]

    const result = await handler.simulate(humanAmountsIn)

    expect(result.bptOut.amount).toBeGreaterThan(40000000000000000n)
  })

  test('builds Tx Config', async () => {
    const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: daiAddress }]

    const handler = selectNestedHandler(nestedPoolMock)

    // Store query response in handler instance
    const queryOutput = await handler.simulate(humanAmountsIn, defaultTestUserAccount)

    const result = await handler.buildCallData({
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
      queryOutput: queryOutput,
    })

    expect(result.to).toBe(networkConfig.contracts.balancer.relayerV6)
    expect(result.data).toBeDefined()
    expect(result.account).toBe(defaultTestUserAccount)

    const { account, data, to, value } = result

    const hash = await testPublicClient.sendTransaction({
      account,
      chain: testPublicClient.chain,
      data,
      to,
      value,
    })

    const transactionReceipt = await testPublicClient.waitForTransactionReceipt({
      hash,
    })

    expect(transactionReceipt).toBeDefined()
  })
})
