import networkConfig from '@/lib/config/networks/mainnet'
import { balAddress, wETHAddress } from '@/lib/debug-helpers'
import { aBalWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { aPhantomStablePoolStateInputMock } from '../../../__mocks__/pool.builders'
import { Pool } from '../../../usePool'
import { QueryRemoveLiquidityInput, RemoveLiquidityType } from '../remove-liquidity.types'
import { selectRemoveLiquidityHandler } from './selectRemoveLiquidityHandler'
import { ProportionalRemoveLiquidityHandler } from './ProportionalRemoveLiquidity.handler'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'

const poolMock = aBalWethPoolElementMock() // 80BAL-20WETH

function selectProportionalHandler(pool: Pool): ProportionalRemoveLiquidityHandler {
  return selectRemoveLiquidityHandler(
    pool,
    RemoveLiquidityType.Proportional
  ) as ProportionalRemoveLiquidityHandler
}

const defaultQueryInput: QueryRemoveLiquidityInput = {
  humanBptIn: '1',
  tokenOut: emptyAddress, // We don't use in this scenario it but it is required to simplify TS interfaces
}

const defaultBuildInput = { account: defaultTestUserAccount, slippagePercent: '0.2' }

describe('When proportionally removing liquidity for a weighted pool', () => {
  test('returns ZERO price impact', async () => {
    const handler = selectProportionalHandler(poolMock)

    const result = await handler.queryRemoveLiquidity(defaultQueryInput)

    const [balTokenAmountOut, wEthTokenAmountOut] = result.amountsOut

    expect(balTokenAmountOut.token.address).toBe(balAddress)
    expect(balTokenAmountOut.amount).toBeGreaterThan(2000000000000000000n)

    expect(wEthTokenAmountOut.token.address).toBe(wETHAddress)
    expect(wEthTokenAmountOut.amount).toBeGreaterThan(100000000000000n)
  })
  test('queries amounts out', async () => {
    const handler = selectProportionalHandler(poolMock)

    const result = await handler.queryRemoveLiquidity(defaultQueryInput)

    const [balTokenAmountOut, wEthTokenAmountOut] = result.amountsOut

    expect(balTokenAmountOut.token.address).toBe(balAddress)
    expect(balTokenAmountOut.amount).toBeGreaterThan(2000000000000000000n)

    expect(wEthTokenAmountOut.token.address).toBe(wETHAddress)
    expect(wEthTokenAmountOut.amount).toBeGreaterThan(100000000000000n)
  })

  test('builds Tx Config', async () => {
    const handler = selectProportionalHandler(poolMock)

    const queryOutput = await handler.queryRemoveLiquidity(defaultQueryInput)

    const result = await handler.buildRemoveLiquidityCallData({
      ...defaultBuildInput,
      queryOutput,
    })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})

describe('When removing liquidity from a stable pool', () => {
  test('queries remove liquidity', async () => {
    const pool = aPhantomStablePoolStateInputMock() as unknown as Pool // wstETH-rETH-sfrxETH

    const handler = selectProportionalHandler(pool)

    const queryOutput = await handler.queryRemoveLiquidity(defaultQueryInput)

    const result = await handler.buildRemoveLiquidityCallData({ ...defaultBuildInput, queryOutput })
    expect(result.account).toBe(defaultTestUserAccount)
  })
})
