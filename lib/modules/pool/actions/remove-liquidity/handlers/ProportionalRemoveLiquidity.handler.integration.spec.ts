import networkConfig from '@/lib/config/networks/mainnet'
import { balAddress, wETHAddress } from '@/lib/debug-helpers'
import { aBalWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { aPhantomStablePoolStateInputMock } from '../../../__mocks__/pool.builders'
import { Pool } from '../../../usePool'
import { RemoveLiquidityInputs, RemoveLiquidityType } from '../remove-liquidity.types'
import { selectRemoveLiquidityHandler } from './selectRemoveLiquidityHandler'

const poolMock = aBalWethPoolElementMock() // 80BAL-20WETH

function selectProportionalHandler(pool: Pool) {
  return selectRemoveLiquidityHandler(pool, RemoveLiquidityType.Proportional)
}

const inputs: RemoveLiquidityInputs = {
  bptInUnits: '1',
  account: defaultTestUserAccount,
  slippagePercent: '0.2',
}

describe('When proportionally removing liquidity for a weighted pool', () => {
  test('returns ZERO price impact', async () => {
    const handler = selectProportionalHandler(poolMock)

    const result = await handler.queryRemoveLiquidity(inputs)

    const [balTokenAmountOut, wEthTokenAmountOut] = result.amountsOut

    expect(balTokenAmountOut.token.address).toBe(balAddress)
    expect(balTokenAmountOut.amount).toBeGreaterThan(2000000000000000000n)

    expect(wEthTokenAmountOut.token.address).toBe(wETHAddress)
    expect(wEthTokenAmountOut.amount).toBeGreaterThan(100000000000000n)
  })
  test('queries amounts out', async () => {
    const handler = selectProportionalHandler(poolMock)

    const result = await handler.queryRemoveLiquidity(inputs)

    const [balTokenAmountOut, wEthTokenAmountOut] = result.amountsOut

    expect(balTokenAmountOut.token.address).toBe(balAddress)
    expect(balTokenAmountOut.amount).toBeGreaterThan(2000000000000000000n)

    expect(wEthTokenAmountOut.token.address).toBe(wETHAddress)
    expect(wEthTokenAmountOut.amount).toBeGreaterThan(100000000000000n)
  })

  test('builds Tx Config', async () => {
    const handler = selectProportionalHandler(poolMock)

    const { sdkQueryOutput } = await handler.queryRemoveLiquidity(inputs)

    const result = await handler.buildRemoveLiquidityTx({ inputs, sdkQueryOutput })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})

describe('When removing liquidity from a stable pool', () => {
  test('queries remove liquidity', async () => {
    const pool = aPhantomStablePoolStateInputMock() as Pool // wstETH-rETH-sfrxETH

    const handler = selectProportionalHandler(pool)

    const { sdkQueryOutput } = await handler.queryRemoveLiquidity(inputs)

    const result = await handler.buildRemoveLiquidityTx({ inputs, sdkQueryOutput })
    expect(result.account).toBe(defaultTestUserAccount)
  })
})
