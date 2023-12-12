import networkConfig from '@/lib/config/networks/mainnet'
import { balAddress, poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { ChainId, HumanAmount } from '@balancer/sdk'
import { aPhantomStablePoolStateInputMock } from '../../../__mocks__/pool.builders'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../add-liquidity.types'
import { selectAddLiquidityHandler } from '../selectAddLiquidityHandler'

const wjAuraWethPoolMock = new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH

function selectUnbalancedHandler() {
  //TODO: refactor mock builders to build poolStateInput and pool at the same time
  return selectAddLiquidityHandler({
    poolStateInput: wjAuraWethPoolMock,
    pool: aWjAuraWethPoolElementMock(),
    chainId: ChainId.MAINNET,
  }).handler
}

describe('When adding unbalanced liquidity for a weighted  pool', () => {
  test('calculates price impact', async () => {
    const handler = selectUnbalancedHandler()

    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const priceImpact = await handler.calculatePriceImpact({ humanAmountsIn })
    expect(priceImpact).toMatchInlineSnapshot(`0.002368782867485742`)
  })

  test('returns NullPriceImpactAmount when amounts in are zero or empty', async () => {
    const handler = selectUnbalancedHandler()

    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '0', tokenAddress: wETHAddress },
      { humanAmount: '', tokenAddress: balAddress },
    ]

    const priceImpact = await handler.calculatePriceImpact({ humanAmountsIn })

    expect(priceImpact).toEqual(0)
  })

  test('queries bptOut', async () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const result = await handler.queryAddLiquidity({
      humanAmountsIn,
    })

    expect(result.bptOut.amount).toBeGreaterThan(396624929366471785523n)
  })

  test('builds Tx Config', async () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const result = await handler.buildAddLiquidityTx({
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
    })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})

describe('When adding unbalanced liquidity for an stable pool', () => {
  test('calculates price impact', async () => {
    const poolStateInput = aPhantomStablePoolStateInputMock() // wstETH-rETH-sfrxETH

    const handler = selectAddLiquidityHandler({
      poolStateInput,
      pool: poolStateInput as Pool,
      chainId: ChainId.MAINNET,
    }).handler

    // wstETH-rETH-sfrxETH has 3 tokens + BPT token:
    // we use 0, 10, 100, 1000 as amounts
    const humanAmountsIn: HumanAmountIn[] = poolStateInput.tokens.map((token, i) => {
      return {
        humanAmount: (10 ** i).toString() as HumanAmount,
        tokenAddress: token.address,
      }
    })

    const priceImpact = await handler.calculatePriceImpact({ humanAmountsIn })
    expect(priceImpact).toMatchInlineSnapshot(`0.006104055180098694`)
  })
})

// TODO: Refactor Single token logic and tests
// test.skip('build Single Token AddLiquidity Config', async () => {
//   const poolStateInput = await getPoolState()

//   const builder = new AddLiquidityConfigBuilder(ChainId.MAINNET, poolStateInput, 'singleToken')

//   // We need to rethink this use case when the SDK is ready
//   const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: wETHAddress }]

//   const result = await builder.query(defaultTestUserAccount, humanAmountsIn)

//   expect(result.minBptOut.amount).toBeGreaterThanOrEqual(1000000000000000000n)
// })

// TODO: Refactor native asset config and test
// test.skip('build Unbalanced Join Config with ETH (mainnet native asset)', async () => {
//   const poolStateInput = await getPoolState()
//   const builder = new AddLiquidityConfigBuilder(
//     ChainId.MAINNET,
//     poolStateInput,
//     'unbalancedNativeAsset'
//   )

//   // The user chose ETH in the UI but we need to pass WETH in amountsIn
//   const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: wETHAddress }]

//   const result = await builder.buildSdkAddLiquidityTxConfig(defaultTestUserAccount, humanAmountsIn)

//   expect(result.minBptOut.amount).toBeGreaterThan(380000000000000000000n)
// })
