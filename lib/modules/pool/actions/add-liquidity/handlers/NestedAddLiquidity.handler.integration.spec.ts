/* eslint-disable max-len */
import networkConfig from '@/lib/config/networks/mainnet'
import { daiAddress, usdcAddress, usdtAddress, wETHAddress } from '@/lib/debug-helpers'
import { defaultTestUserAccount, testPublicClient } from '@/test/utils/wagmi'
import { nestedPoolMock } from '../../../__mocks__/nestedPoolMock'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { NestedAddLiquidityHandler } from './NestedAddLiquidity.handler'
import { selectAddLiquidityHandler } from './selectAddLiquidityHandler'

function selectNestedHandler(pool: Pool) {
  return selectAddLiquidityHandler(pool) as NestedAddLiquidityHandler
}

describe('When adding nested liquidity for a weighted pool', () => {
  test('has zero price impact', async () => {
    const handler = selectNestedHandler(nestedPoolMock)

    const priceImpact = await handler.calculatePriceImpact()
    expect(priceImpact).toBe(0)
  })

  test('with single token input', async () => {
    const handler = selectNestedHandler(nestedPoolMock)

    const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: daiAddress }]

    const result = await handler.queryAddLiquidity(humanAmountsIn)

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

    const result = await handler.queryAddLiquidity(humanAmountsIn)

    expect(result.bptOut.amount).toBeGreaterThan(40000000000000000n)
  })

  test('builds Tx Config', async () => {
    const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: daiAddress }]

    const handler = selectNestedHandler(nestedPoolMock)

    // Store query response in handler instance
    const queryOutput = await handler.queryAddLiquidity(humanAmountsIn, defaultTestUserAccount)

    const result = await handler.buildAddLiquidityCallData({
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
      queryOutput: queryOutput,
    })

    expect(result.to).toBe(networkConfig.contracts.balancer.relayer)
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
