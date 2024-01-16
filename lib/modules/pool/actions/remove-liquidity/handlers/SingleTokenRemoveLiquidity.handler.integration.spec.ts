import networkConfig from '@/lib/config/networks/mainnet'
import { balAddress, wETHAddress } from '@/lib/debug-helpers'
import { aBalWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { Pool } from '../../../usePool'
import { QueryRemoveLiquidityInput, RemoveLiquidityType } from '../remove-liquidity.types'
import { selectRemoveLiquidityHandler } from './selectRemoveLiquidityHandler'
import { SingleTokenRemoveLiquidityHandler } from './SingleTokenRemoveLiquidity.handler'

const poolMock = aBalWethPoolElementMock() // 80BAL-20WETH

function selectSingleTokenHandler(pool: Pool): SingleTokenRemoveLiquidityHandler {
  return selectRemoveLiquidityHandler(
    pool,
    RemoveLiquidityType.SingleToken
  ) as SingleTokenRemoveLiquidityHandler
}

const defaultQueryInput: QueryRemoveLiquidityInput = {
  humanBptIn: '1',
  tokenOut: balAddress,
}

const defaultBuildInput = { account: defaultTestUserAccount, slippagePercent: '0.2' }

describe('When removing unbalanced liquidity for a weighted pool', () => {
  test('queries amounts out', async () => {
    const handler = selectSingleTokenHandler(poolMock)

    const result = await handler.queryRemoveLiquidity(defaultQueryInput)

    const [balTokenAmountOut, wEthTokenAmountOut] = result.amountsOut

    expect(balTokenAmountOut.token.address).toBe(balAddress)
    expect(balTokenAmountOut.amount).toBeGreaterThan(2000000000000000000n)

    expect(wEthTokenAmountOut.token.address).toBe(wETHAddress)
    expect(wEthTokenAmountOut.amount).toBe(0n)
  })

  test('builds Tx Config', async () => {
    const handler = selectSingleTokenHandler(poolMock)

    const inputs: QueryRemoveLiquidityInput = {
      humanBptIn: '1',
      tokenOut: balAddress,
    }

    await handler.queryRemoveLiquidity(inputs)

    const result = await handler.buildRemoveLiquidityCallData(defaultBuildInput)

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})
