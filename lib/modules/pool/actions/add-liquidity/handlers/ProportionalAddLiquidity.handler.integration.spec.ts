/* eslint-disable max-len */
import networkConfig from '@/lib/config/networks/mainnet'
import { startFork } from '@/test/anvil/anvil-runner'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { testPublicClient } from '@/test/utils/wagmi/wagmi-test-setup'
import { gyroPoolMock } from '../../../__mocks__/gyroPoolMock'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { ProportionalAddLiquidityHandler } from './ProportionalAddLiquidity.handler'
import { selectAddLiquidityHandler } from './selectAddLiquidityHandler'

function selectProportionalHandler(pool: Pool) {
  return selectAddLiquidityHandler(pool) as ProportionalAddLiquidityHandler
}

// USDC address in polygon
const usdcAddress = '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' as const
const daiAddress = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063' as const

describe('When adding proportional liquidity for a gyro pool', () => {
  beforeAll(async () => {
    await startFork('POLYGON')
  })

  test('has zero price impact', async () => {
    const handler = selectProportionalHandler(gyroPoolMock)

    const priceImpact = await handler.getPriceImpact()
    expect(priceImpact).toBe(0)
  })

  test('simulates given a single human amount', async () => {
    const handler = selectProportionalHandler(gyroPoolMock)

    const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: usdcAddress }]

    const result = await handler.simulate(humanAmountsIn)

    expect(result.bptOut.amount).toBeGreaterThan(0n)
    const usdcAmountIn = result.sdkQueryOutput.amountsIn[0]
    const daiAmountIn = result.sdkQueryOutput.amountsIn[1]

    expect(usdcAmountIn.token.address).toBe(usdcAddress)
    expect(usdcAmountIn.amount).toBeGreaterThan(0n)
    expect(daiAmountIn.token.address).toBe(daiAddress)
    expect(daiAmountIn.amount).toBeGreaterThan(0n)
  })

  test('builds Tx Config', async () => {
    const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: usdcAddress }]

    const handler = selectProportionalHandler(gyroPoolMock)

    // Store query response in handler instance
    const queryOutput = await handler.simulate(humanAmountsIn)

    const result = await handler.buildCallData({
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
      queryOutput: queryOutput,
    })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
    expect(result.account).toBe(defaultTestUserAccount)

    const hash = await testPublicClient.sendTransaction({
      ...result,
      chain: testPublicClient.chain,
    })

    const transactionReceipt = await testPublicClient.waitForTransactionReceipt({
      hash,
    })

    expect(transactionReceipt).toBeDefined()
  })
})
