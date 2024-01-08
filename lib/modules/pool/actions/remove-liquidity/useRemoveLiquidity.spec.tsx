import { balAddress, wETHAddress } from '@/lib/debug-helpers'
import { aTokenPriceMock } from '@/lib/modules/tokens/__mocks__/token.builders'
import { GqlPoolElement } from '@/lib/shared/services/api/generated/graphql'
import { aBalWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { aUserPoolBalance } from '@/test/msw/builders/gqlUserBalance.builders'
import { mockTokenPricesList } from '@/test/msw/handlers/Tokens.handlers'
import { buildDefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { act } from 'react-dom/test-utils'
import { aTokenAmountMock } from '../__mocks__/liquidity.builders'
import { RemoveLiquidityPreviewQueryResult } from './queries/useRemoveLiquidityPreviewQuery'
import { _useRemoveLiquidity } from './useRemoveLiquidity'
import { waitFor } from '@testing-library/react'

const balTokenOutUnits = '1'
const wEthTokenOutUnits = '0.5'

// Mock query to avoid onchain SDK call from unit tests
vi.mock('./queries/useRemoveLiquidityPreviewQuery', () => {
  return {
    useRemoveLiquidityPreviewQuery(): RemoveLiquidityPreviewQueryResult {
      return {
        amountsOut: [
          aTokenAmountMock(balAddress, balTokenOutUnits),
          aTokenAmountMock(wETHAddress, wEthTokenOutUnits),
        ],
        isPreviewQueryLoading: false,
      }
    },
  }
})

const balPrice = 2
const wethPrice = 3
mockTokenPricesList([
  aTokenPriceMock({ address: balAddress, price: balPrice }),
  aTokenPriceMock({ address: wETHAddress, price: wethPrice }),
])

async function testUseRemoveLiquidity(pool: GqlPoolElement = aBalWethPoolElementMock()) {
  const { result } = testHook(() => _useRemoveLiquidity(), {
    wrapper: buildDefaultPoolTestProvider(pool),
  })
  return result
}

describe('When the user choses proportional remove liquidity', () => {
  test('recalculates totalUsdValue when changing the slider', async () => {
    const result = await testUseRemoveLiquidity()

    expect(result.current.isProportional).toBeTruthy()
    expect(result.current.bptInUnitsPercent).toBe(100)
    const initialTotalUsdValue = result.current.totalUsdValue

    act(() => result.current.setBptInUnitsPercent(50))
    expect(result.current.bptInUnitsPercent).toBe(50)

    expect(result.current.totalUsdValue).toBeCloseTo(Number(initialTotalUsdValue) / 2)
  })

  test('calculates totalUsdValue', async () => {
    const poolMock = aBalWethPoolElementMock() // 80BAL-20WETH

    poolMock.userBalance = aUserPoolBalance({ totalBalance: '200' }) // maxBptUnits
    poolMock.dynamicData.totalLiquidity = '1000'
    poolMock.dynamicData.totalShares = '100'
    // bptPrice = 1000/100 = 10
    const result = await testUseRemoveLiquidity(poolMock)

    // totalUsdValue = bptPrice * maxBptUnits = 10 * 200 = 2000
    expect(result.current.totalUsdValue).toBe('2000')
  })

  test('calculates tokenOutUnitsByAddress', async () => {
    const result = await testUseRemoveLiquidity()

    expect(result.current.tokenOutUnitsByAddress).toEqual({
      [balAddress]: balTokenOutUnits,
      [wETHAddress]: wEthTokenOutUnits,
    })
  })

  test('calculates tokenOutUsdByAddress', async () => {
    const result = await testUseRemoveLiquidity()

    // By default token prices are 0.00
    expect(result.current.tokenOutUsdByAddress).toEqual({
      [balAddress]: '0.00',
      [wETHAddress]: '0.00',
    })

    await waitFor(() =>
      expect(result.current.tokenOutUsdByAddress[balAddress] !== '0.00').toBeTruthy()
    )
    await waitFor(() =>
      expect(result.current.tokenOutUsdByAddress[wETHAddress] !== '0.00').toBeTruthy()
    )

    expect(result.current.tokenOutUsdByAddress).toEqual({
      [balAddress]: '2.00', // balTokenOutUnits * balPrice = 1 * 2 = 2.00
      [wETHAddress]: '1.50', // wethTokenOutUnits x wethPrice = 0.5 * 3 = 1.50 with 18 decimals
    })
  })
})

describe('When the user choses single token remove liquidity', () => {
  test('returns selected token address', async () => {
    const result = await testUseRemoveLiquidity()

    act(() => result.current.setSingleTokenType())
    act(() => result.current.setSingleTokenAddress(wETHAddress))

    expect(result.current.singleTokenAddress).toEqual(wETHAddress)
  })
})
