import { testHook } from '@/test/utils/custom-renderers'
import { bn, fNum } from '../utils/numbers'
import { useAprTooltip } from './useAprTooltip'
import { aprTooltipDataMock } from './_mocks_/aprTooltipDataMock'
import BigNumber from 'bignumber.js'

const defaultNumberFormatter = (value: string) => bn(bn(value).toFixed(4, BigNumber.ROUND_HALF_UP))

describe('useAprTooltip', () => {
  test('formats APRs with default formatter', () => {
    aprTooltipDataMock
    const { result } = testHook(() =>
      useAprTooltip({ ...aprTooltipDataMock, numberFormatter: defaultNumberFormatter })
    )

    expect(result.current.swapFeesDisplayed.toFixed()).toBe('0.0007')
    expect(fNum('apr', result.current.swapFeesDisplayed)).toBe('0.07%')

    const stakingIncentivesApr = result.current.stakingIncentivesDisplayed[0].apr
    expect(stakingIncentivesApr.toFixed()).toBe('0.0191')
    expect(fNum('apr', stakingIncentivesApr)).toBe('1.91%')

    const yieldBearingTokensApr = result.current.yieldBearingTokensDisplayed[0].apr
    expect(yieldBearingTokensApr.toFixed()).toBe('0.0068')
    expect(fNum('apr', yieldBearingTokensApr)).toBe('0.68%')

    const totalBaseDisplayed = result.current.totalBaseDisplayed
    expect(totalBaseDisplayed.toFixed()).toBe('0.0266')
    expect(fNum('apr', totalBaseDisplayed)).toBe('2.66%') // 0.07 + 1.91 + 0.68 = 2.66

    const extraBalApr = result.current.extraBalAprDisplayed
    expect(extraBalApr.toFixed()).toBe('0.0287')
    expect(fNum('apr', extraBalApr)).toBe('2.87%')

    const maxVeBalApr = result.current.maxVeBalDisplayed
    expect(maxVeBalApr.toFixed()).toBe('0.0553')
    expect(fNum('apr', maxVeBalApr)).toBe('5.53%') // 2.66 + 2.87 = 5.53
  })
})
