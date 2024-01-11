import networkConfig from '@/lib/config/networks/mainnet'
import { balAddress, wETHAddress } from '@/lib/debug-helpers'
import { aBalWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { Pool } from '../../../usePool'
import { RemoveLiquidityInputs, RemoveLiquidityType } from '../remove-liquidity.types'
import { selectRemoveLiquidityHandler } from './selectRemoveLiquidityHandler'

const poolMock = aBalWethPoolElementMock() // 80BAL-20WETH

function selectSingleTokenHandler(pool: Pool) {
  return selectRemoveLiquidityHandler(pool, RemoveLiquidityType.SingleToken)
}

describe('When removing unbalanced liquidity for a weighted pool', () => {
  test('queries amounts out', async () => {
    const inputs: RemoveLiquidityInputs = {
      humanBptIn: '1',
      account: defaultTestUserAccount,
      tokenOut: balAddress,
    }

    const handler = selectSingleTokenHandler(poolMock)

    const result = await handler.queryRemoveLiquidity(inputs)

    const [balTokenAmountOut, wEthTokenAmountOut] = result.amountsOut

    expect(balTokenAmountOut.token.address).toBe(balAddress)
    expect(balTokenAmountOut.amount).toBeGreaterThan(2000000000000000000n)

    expect(wEthTokenAmountOut.token.address).toBe(wETHAddress)
    expect(wEthTokenAmountOut.amount).toBe(0n)
  })

  test('builds Tx Config', async () => {
    const handler = selectSingleTokenHandler(poolMock)

    const inputs: RemoveLiquidityInputs = {
      humanBptIn: '1',
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
      tokenOut: balAddress,
    }

    const { sdkQueryOutput } = await handler.queryRemoveLiquidity(inputs)

    const result = await handler.buildRemoveLiquidityTx({ inputs, sdkQueryOutput })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})
