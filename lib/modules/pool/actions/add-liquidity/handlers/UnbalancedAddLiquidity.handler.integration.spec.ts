import networkConfig from '@/lib/config/networks/mainnet'
import { balAddress, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { HumanAmount } from '@balancer/sdk'
import { Address } from 'viem'
import { aPhantomStablePoolStateInputMock } from '../../../__mocks__/pool.builders'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { SdkBuildAddLiquidityInputs } from '../add-liquidity.types'
import { UnbalancedAddLiquidityHandler } from './UnbalancedAddLiquidity.handler'
import { selectAddLiquidityHandler } from './selectAddLiquidityHandler'

function selectUnbalancedHandler() {
  return selectAddLiquidityHandler(aWjAuraWethPoolElementMock()) as UnbalancedAddLiquidityHandler
}

describe('When adding unbalanced liquidity for a weighted  pool', () => {
  test('calculates price impact', async () => {
    const handler = selectUnbalancedHandler()

    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const priceImpact = await handler.calculatePriceImpact(humanAmountsIn)
    expect(priceImpact).toBeGreaterThan(0.002)
  })

  test('returns zero price impact when amounts in are zero or empty', async () => {
    const handler = selectUnbalancedHandler()

    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '0', tokenAddress: wETHAddress },
      { humanAmount: '', tokenAddress: balAddress },
    ]

    const priceImpact = await handler.calculatePriceImpact(humanAmountsIn)

    expect(priceImpact).toEqual(0)
  })

  test('queries bptOut', async () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const result = await handler.queryAddLiquidity(humanAmountsIn)

    expect(result.bptOut.amount).toBeGreaterThan(300000000000000000000n)
  })

  test('builds Tx Config', async () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const { sdkQueryOutput } = await handler.queryAddLiquidity(humanAmountsIn)

    const buildInputs: SdkBuildAddLiquidityInputs = {
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
      sdkQueryOutput,
    }
    const result = await handler.buildAddLiquidityCallData(buildInputs)

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})

describe('When adding unbalanced liquidity for a stable pool', () => {
  test('calculates price impact', async () => {
    const pool = aPhantomStablePoolStateInputMock() as Pool // wstETH-rETH-sfrxETH

    const handler = selectAddLiquidityHandler(pool)

    // wstETH-rETH-sfrxETH has 3 tokens + BPT token:
    // we use 0, 10, 100, 1000 as amounts
    const humanAmountsIn: HumanAmountIn[] = pool.tokens.map((token, i) => {
      return {
        humanAmount: (10 ** i).toString() as HumanAmount,
        tokenAddress: token.address as Address,
      }
    })

    const priceImpact = await handler.calculatePriceImpact(humanAmountsIn)
    expect(priceImpact).toBeGreaterThan(0.001)
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
