import networkConfig from '@/lib/config/networks/mainnet'
import { balAddress, sepoliaRouter, wETHAddress } from '@/lib/debug-helpers'
import { aBalWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/anvil/anvil-setup'
import { Pool } from '../../../PoolProvider'
import { QueryRemoveLiquidityInput, RemoveLiquidityType } from '../remove-liquidity.types'
import { SingleTokenRemoveLiquidityHandler } from './SingleTokenRemoveLiquidity.handler'
import { selectRemoveLiquidityHandler } from './selectRemoveLiquidityHandler'
import { getPoolMock } from '../../../__mocks__/getPoolMock'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

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

describe('When removing unbalanced liquidity for a weighted V2 pool', () => {
  const v2poolMock = aBalWethPoolElementMock() // 80BAL-20WETH

  test('queries amounts out', async () => {
    const handler = selectSingleTokenHandler(v2poolMock)

    const result = await handler.simulate(defaultQueryInput)

    const [balTokenAmountOut, wEthTokenAmountOut] = result.amountsOut

    expect(balTokenAmountOut.token.address).toBe(balAddress)
    expect(balTokenAmountOut.amount).toBeGreaterThan(2000000000000000000n)

    expect(wEthTokenAmountOut.token.address).toBe(wETHAddress)
    expect(wEthTokenAmountOut.amount).toBe(0n)
  })

  test('builds Tx Config', async () => {
    const handler = selectSingleTokenHandler(v2poolMock)

    const inputs: QueryRemoveLiquidityInput = {
      humanBptIn: '1',
      tokenOut: balAddress,
    }

    const queryOutput = await handler.simulate(inputs)

    const result = await handler.buildCallData({ ...defaultBuildInput, queryOutput })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})

describe('When removing unbalanced liquidity for a weighted V3 pool', async () => {
  // Sepolia
  const balAddress = '0xb19382073c7a0addbb56ac6af1808fa49e377b75'
  const wethAddress = '0x7b79995e5f793a07bc00c21412e50ecae098e7f9'
  const poolId = '0x7cf221fa36584f59a4f7fd7b946b8571c78e3692' // Sepolia B-50BAL-50WETH
  const v3Pool = await getPoolMock(poolId, GqlChain.Sepolia)

  const defaultQueryInput: QueryRemoveLiquidityInput = {
    humanBptIn: '0.1',
    tokenOut: balAddress,
  }

  test('queries amounts out', async () => {
    const handler = selectSingleTokenHandler(v3Pool)

    const result = await handler.simulate(defaultQueryInput)

    const [wEthTokenAmountOut, balTokenAmountOut] = result.amountsOut

    expect(wEthTokenAmountOut.token.address).toBe(wethAddress)
    expect(wEthTokenAmountOut.amount).toBe(0n)

    expect(balTokenAmountOut.token.address).toBe(balAddress)
    expect(balTokenAmountOut.amount).toBeGreaterThan(2000000000000000000n)
  })

  test('builds Tx Config', async () => {
    const handler = selectSingleTokenHandler(v3Pool)

    const queryOutput = await handler.simulate(defaultQueryInput)

    const result = await handler.buildCallData({ ...defaultBuildInput, queryOutput })

    expect(result.to).toBe(sepoliaRouter)
    expect(result.data).toBeDefined()
  })
})
