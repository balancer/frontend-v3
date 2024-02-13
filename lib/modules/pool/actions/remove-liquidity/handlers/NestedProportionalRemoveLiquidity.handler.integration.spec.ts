import networkConfig from '@/lib/config/networks/mainnet'
import { wETHAddress } from '@/lib/debug-helpers'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { nestedPoolMock } from '../../../__mocks__/nestedPoolMock'
import { Pool } from '../../../usePool'
import { QueryRemoveLiquidityInput, RemoveLiquidityType } from '../remove-liquidity.types'
import { NestedProportionalRemoveLiquidityHandler } from './NestedProportionalRemoveLiquidity.handler'
import { selectRemoveLiquidityHandler } from './selectRemoveLiquidityHandler'
import { testPublicClient } from '@/test/utils/wagmi/wagmi-test-setup'

function selectNestedProportionalHandler(pool: Pool): NestedProportionalRemoveLiquidityHandler {
  return selectRemoveLiquidityHandler(
    pool,
    RemoveLiquidityType.Proportional
  ) as NestedProportionalRemoveLiquidityHandler
}

const defaultQueryInput: QueryRemoveLiquidityInput = {
  humanBptIn: '1',
  tokenOut: emptyAddress, // We don't use in this scenario it but it is required to simplify TS interfaces
}

const defaultBuildInput = { account: defaultTestUserAccount, slippagePercent: '0.2' }

describe('When proportionally removing liquidity for a nested pool', () => {
  test('returns ZERO price impact', async () => {
    const handler = selectNestedProportionalHandler(nestedPoolMock)

    const priceImpact = await handler.getPriceImpact()

    expect(priceImpact).toBe(0)
  })

  test('queries amounts out', async () => {
    const handler = selectNestedProportionalHandler(nestedPoolMock)

    const result = await handler.simulate(defaultQueryInput)

    expect(result.amountsOut).toHaveLength(4) // Nested pool has 4 tokens

    const wethTokenAmountOut = result.amountsOut[0]
    expect(wethTokenAmountOut.token.address).toBe(wETHAddress)
    expect(wethTokenAmountOut.amount).toBeGreaterThan(0n)
  })

  test.only('builds Tx Config', async () => {
    const handler = selectNestedProportionalHandler(nestedPoolMock)

    const queryOutput = await handler.simulate(defaultQueryInput)

    const result = await handler.buildCallData({
      ...defaultBuildInput,
      queryOutput,
    })

    expect(result.to).toBe(networkConfig.contracts.balancer.relayerV6)
    expect(result.data).toBeDefined()

    const hash = await testPublicClient.sendTransaction({
      ...result,
      account: defaultTestUserAccount,
      chain: testPublicClient.chain,
    })

    const transactionReceipt = await testPublicClient.waitForTransactionReceipt({
      hash,
    })

    expect(transactionReceipt).toBeDefined()
  })
})
