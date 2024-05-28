import { testHook } from '@/test/utils/custom-renderers'
import { fNum } from '../utils/numbers'
import { aprTooltipDataMock1 } from './_mocks_/aprTooltipDataMock1'
import { useAprTooltip } from './useAprTooltip'
import { aprTooltipDataMock2 } from './_mocks_/aprTooltipDataMock2'

describe('useAprTooltip', () => {
  test('with <0.01% apr', () => {
    aprTooltipDataMock1
    const { result } = testHook(() => useAprTooltip(aprTooltipDataMock1))

    expect(result.current.swapFeesDisplayed).toBe('0.000007489453040656273')
    expect(fNum('apr', result.current.swapFeesDisplayed)).toBe('<0.01%')

    const stakingIncentivesApr = result.current.stakingIncentivesDisplayed[0].apr
    expect(stakingIncentivesApr).toBe('0.0179827288863146')
    expect(fNum('apr', stakingIncentivesApr)).toBe('1.80%')

    const yieldBearingTokensApr = result.current.yieldBearingTokensDisplayed[0].apr
    expect(yieldBearingTokensApr).toBe('0.007561511267738821')
    expect(fNum('apr', yieldBearingTokensApr)).toBe('0.76%')

    const totalBaseDisplayed = result.current.totalBaseDisplayed
    expect(totalBaseDisplayed).toBe('0.02555172960709408')
    expect(fNum('apr', totalBaseDisplayed)).toBe('2.56%') // 0.01% + 1.80 + 0.76 = 2.56

    const extraBalApr = result.current.extraBalAprDisplayed
    expect(extraBalApr.toFixed()).toBe('0.026974093329471904')
    expect(fNum('apr', extraBalApr)).toBe('2.70%')

    const maxVeBalApr = result.current.maxVeBalDisplayed
    expect(maxVeBalApr.toFixed()).toBe('0.052525822936565984')
    expect(fNum('apr', maxVeBalApr)).toBe('5.25%') // 2.56 + 2.70 = 5.26 --> rounding error
  })

  test('with another example', () => {
    aprTooltipDataMock1
    const { result } = testHook(() => useAprTooltip(aprTooltipDataMock2))

    expect(result.current.swapFeesDisplayed).toBe('0.000350284482429801')
    expect(fNum('apr', result.current.swapFeesDisplayed)).toBe('0.04%')

    const stakingIncentivesApr = result.current.stakingIncentivesDisplayed[0].apr
    expect(stakingIncentivesApr).toBe('0.006170657675830251')
    expect(fNum('apr', stakingIncentivesApr)).toBe('0.62%')

    const yieldBearingTokensApr = result.current.yieldBearingTokensDisplayed[0].apr
    expect(yieldBearingTokensApr).toBe('0.007535148019485108')
    expect(fNum('apr', yieldBearingTokensApr)).toBe('0.75%')
    const yieldBearingTokensApr2 = result.current.yieldBearingTokensDisplayed[1].apr
    expect(yieldBearingTokensApr2).toBe('0.006253043851994472')
    expect(fNum('apr', yieldBearingTokensApr2)).toBe('0.63%')
    const yieldBearingTokensAprDisplayed = result.current.yieldBearingTokensAprDisplayed
    expect(yieldBearingTokensAprDisplayed).toBe('0.01378819187147958')
    expect(fNum('apr', yieldBearingTokensAprDisplayed)).toBe('1.38%') // 0.75 + 0.63 = 1.38

    const totalBaseDisplayed = result.current.totalBaseDisplayed
    expect(totalBaseDisplayed).toBe('0.02030913402973963')
    expect(fNum('apr', totalBaseDisplayed)).toBe('2.03%') // 0.04 + 0.62 + 1.38 = 2.04 // rounding error

    const extraBalApr = result.current.extraBalAprDisplayed
    expect(extraBalApr.toFixed()).toBe('0.00925598651374538')
    expect(fNum('apr', extraBalApr)).toBe('0.93%')

    const maxVeBalApr = result.current.maxVeBalDisplayed
    expect(maxVeBalApr.toFixed()).toBe('0.02956512054348501')
    expect(fNum('apr', maxVeBalApr)).toBe('2.96%') // 2.03 + 0.93 = 2.96
  })
})
