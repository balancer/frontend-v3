import { balAddress, poolId, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { AddLiquidityConfigBuilder } from '../AddLiquidityConfigBuilder'
import { ChainId, HumanAmount, PoolStateInput } from '@balancer/sdk'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { HumanAmountIn } from '../add-liquidity.types'
import { UnbalancedAddLiquidityHandler } from './UnbalancedAddLiquidity.handler'
import { AddLiquidityService } from '../AddLiquidityService'
import networkConfig from '@/lib/config/networks/mainnet'
import {
  aPhantomStablePoolStateInputMock,
  aPoolStateInputMock,
} from '../../../__mocks__/pool.builders'

function getPoolState() {
  return new MockApi().getPool(poolId) // Balancer Weighted wjAura and WETH
}

async function buildUnbalancedHandler(poolStateInput: PoolStateInput = getPoolState()) {
  const handler = new UnbalancedAddLiquidityHandler(
    new AddLiquidityService(ChainId.MAINNET, poolStateInput, 'unbalanced')
  )
  return handler
}

describe('When adding unbalanced liquidity for a weighted  pool', () => {
  test('calculates price impact', async () => {
    const poolStateInput = aPoolStateInputMock()
    const handler = await buildUnbalancedHandler(poolStateInput)

    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: balAddress },
    ]

    const priceImpact = await handler.calculatePriceImpact({ humanAmountsIn })
    expect(priceImpact).toMatchInlineSnapshot(`0.00798357727477166`)
  })

  test('returns NullPriceImpactAmount when amounts in are zero or empty', async () => {
    const poolStateInput = aPoolStateInputMock()

    const handler = await buildUnbalancedHandler(poolStateInput)

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

    const handler = await buildUnbalancedHandler()

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

    const handler = await buildUnbalancedHandler()

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
    const handler = await buildUnbalancedHandler(poolStateInput)

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

test.skip('build Single Token AddLiquidity Config', async () => {
  const poolStateInput = await getPoolState()

  const builder = new AddLiquidityConfigBuilder(ChainId.MAINNET, poolStateInput, 'singleToken')

  // We need to rethink this use case when the SDK is ready
  const humanAmountsIn: HumanAmountIn[] = [{ humanAmount: '1', tokenAddress: wETHAddress }]

  const result = await builder.query(defaultTestUserAccount, humanAmountsIn)

  expect(result.minBptOut.amount).toBeGreaterThanOrEqual(1000000000000000000n)
})

// TODO: Refactor this test
test.skip('build Unbalanced Join Config with ETH (mainnet native asset)', async () => {
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
