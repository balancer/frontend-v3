/* eslint-disable max-len */
import networkConfig from '@/lib/config/networks/mainnet'
import { balAddress, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { UnbalancedAddLiquidityHandler } from './UnbalancedAddLiquidity.handler'
import { selectAddLiquidityHandler } from './selectAddLiquidityHandler'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { Pool } from '../../../PoolProvider'

function selectUnbalancedHandler() {
  return selectAddLiquidityHandler(aWjAuraWethPoolElementMock()) as UnbalancedAddLiquidityHandler
}

describe('When adding unbalanced liquidity for a weighted V2 pool', () => {
  test('calculates price impact', async () => {
    const handler = selectUnbalancedHandler()

    const humanAmountsIn: HumanTokenAmountWithAddress[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const priceImpact = await handler.getPriceImpact(humanAmountsIn)
    expect(priceImpact).toBeGreaterThan(0.002)
  })

  test('returns zero price impact when amounts in are zero or empty', async () => {
    const handler = selectUnbalancedHandler()

    const humanAmountsIn: HumanTokenAmountWithAddress[] = [
      { humanAmount: '0', tokenAddress: wETHAddress },
      { humanAmount: '', tokenAddress: balAddress },
    ]

    const priceImpact = await handler.getPriceImpact(humanAmountsIn)

    expect(priceImpact).toEqual(0)
  })

  test('queries bptOut', async () => {
    const humanAmountsIn: HumanTokenAmountWithAddress[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const result = await handler.simulate(humanAmountsIn)

    expect(result.bptOut.amount).toBeGreaterThan(300000000000000000000n)
  })

  test('builds Tx Config', async () => {
    const humanAmountsIn: HumanTokenAmountWithAddress[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    // Store query response in handler instance
    const queryOutput = await handler.simulate(humanAmountsIn)

    const result = await handler.buildCallData({
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
      queryOutput,
    })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})

// TODO: unskip this test when sepolia V3 pools are available in production api
describe.skip('When adding unbalanced liquidity for a V3 pool', async () => {
  // Sepolia
  const balAddress = '0xb19382073c7a0addbb56ac6af1808fa49e377b75'
  // const poolId = '0xec1b5ca86c83c7a85392063399e7d2170d502e00' // Sepolia B-50BAL-50WETH
  // const v3Pool = await getPoolMock(poolId, GqlChain.Sepolia)
  const v3Pool = {} as unknown as Pool

  const handler = selectAddLiquidityHandler(v3Pool) as UnbalancedAddLiquidityHandler

  const humanAmountsIn: HumanTokenAmountWithAddress[] = [
    { humanAmount: '0.1', tokenAddress: balAddress },
  ]

  it('calculates price impact', async () => {
    const priceImpact = await handler.getPriceImpact(humanAmountsIn)
    expect(priceImpact).toBeGreaterThan(0.002)
  })

  it('queries bptOut', async () => {
    const result = await handler.simulate(humanAmountsIn)

    expect(result.bptOut.amount).toBeGreaterThan(100000000000000n)
  })

  it('builds Tx Config', async () => {
    // Store query response in handler instance
    const queryOutput = await handler.simulate(humanAmountsIn)

    const result = await handler.buildCallData({
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
      queryOutput,
    })

    const sepoliaRouter = '0xB12FcB422aAe6720f882E22C340964a7723f2387'
    expect(result.to).toBe(sepoliaRouter)
    expect(result.data).toBeDefined()
  })
})
