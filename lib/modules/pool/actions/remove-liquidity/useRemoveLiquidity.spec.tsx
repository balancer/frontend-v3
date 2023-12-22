import { balAddress, wETHAddress } from '@/lib/debug-helpers'
import { aBalWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { buildDefaultPoolTestProvider, testHook } from '@/test/utils/custom-renderers'
import { act } from 'react-dom/test-utils'
import { mainnet } from 'wagmi'
import { _useRemoveLiquidity } from './useRemoveLiquidity'

const poolMock = aBalWethPoolElementMock() // 80BAL-20WETH
poolMock.dynamicData.totalLiquidity = '1000'
poolMock.dynamicData.totalShares = '100'
// bptPrice will be 1000/10 = 100

async function testUseRemoveLiquidity() {
  const { result } = testHook(() => _useRemoveLiquidity(), {
    wrapper: buildDefaultPoolTestProvider(poolMock),
  })
  return result
}

describe('When the user choses proportional remove liquidity', () => {
  test('uses Proportional liquidity type with 100% percentage by default', async () => {
    const result = await testUseRemoveLiquidity()

    expect(result.current.isProportional).toBeTruthy()
    expect(result.current.sliderPercent).toBe(100)
    expect(result.current.totalUsdValue).toBe('10000')
  })

  test('recalculates totalUsdValue when changing the slider', async () => {
    const result = await testUseRemoveLiquidity()

    expect(result.current.totalUsdValue).toBe('10000')

    act(() => result.current.setSliderPercent(50))
    expect(result.current.sliderPercent).toBe(50)

    expect(result.current.totalUsdValue).toBe('5000')
  })
})

describe('When the user choses single token remove liquidity', () => {
  test('returns selected token address with empty amount by default', async () => {
    const result = await testUseRemoveLiquidity()

    act(() => result.current.setSingleTokenAddress(wETHAddress))

    expect(result.current.singleTokenAddress).toEqual(wETHAddress)
    //TODO: check empty amount
  })
})
