import networkConfig from '@/lib/config/networks/mainnet'
import { daiAddress } from '@/lib/debug-helpers'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { nestedPoolMock } from '../../../__mocks__/nestedPoolMock'
import { Pool } from '../../../usePool'
import { QueryRemoveLiquidityInput, RemoveLiquidityType } from '../remove-liquidity.types'
import { selectRemoveLiquidityHandler } from './selectRemoveLiquidityHandler'
import { testPublicClient } from '@/test/utils/wagmi/wagmi-test-setup'
import { NestedSingleTokenRemoveLiquidityHandler } from './NestedSingleTokenRemoveLiquidity.handler'

function selectNestedSingleTokenHandler(pool: Pool): NestedSingleTokenRemoveLiquidityHandler {
  return selectRemoveLiquidityHandler(
    pool,
    RemoveLiquidityType.SingleToken
  ) as NestedSingleTokenRemoveLiquidityHandler
}

const defaultQueryInput: QueryRemoveLiquidityInput = {
  humanBptIn: '1',
  tokenOut: daiAddress,
}

const defaultBuildInput = { account: defaultTestUserAccount, slippagePercent: '0.2' }

describe('When removing liquidity with single token in a nested pool', () => {
  test('returns ZERO price impact (SDK WIP)', async () => {
    const handler = selectNestedSingleTokenHandler(nestedPoolMock)

    const priceImpact = await handler.getPriceImpact()

    // Price impact will be zero while we wait for the SDK implementation:
    // https://github.com/balancer/b-sdk/pull/244
    expect(priceImpact).toBe(0)
  })

  test('queries amounts out', async () => {
    const handler = selectNestedSingleTokenHandler(nestedPoolMock)

    const result = await handler.simulate(defaultQueryInput)

    expect(result.amountsOut).toHaveLength(1) // amountsOut only contains single token (DAI)

    const daiTokenAmountOut = result.amountsOut[0]
    expect(daiTokenAmountOut.token.address).toBe(daiAddress)
    expect(daiTokenAmountOut.amount).toBeGreaterThan(0n)
  })

  test('builds Tx Config', async () => {
    const handler = selectNestedSingleTokenHandler(nestedPoolMock)

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
