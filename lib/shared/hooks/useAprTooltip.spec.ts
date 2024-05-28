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

    expect(result.current.swapFeesDisplayed).toBe('0.0002217078418900592')
    expect(fNum('apr', result.current.swapFeesDisplayed)).toBe('0.02%')

    const stakingIncentivesApr = result.current.stakingIncentivesDisplayed[0].apr
    expect(stakingIncentivesApr).toBe('0.01227364307382197')
    expect(fNum('apr', stakingIncentivesApr)).toBe('1.23%')

    const yieldBearingTokensApr = result.current.yieldBearingTokensDisplayed[0].apr
    expect(yieldBearingTokensApr).toBe('0.01064005055663294')
    expect(fNum('apr', yieldBearingTokensApr)).toBe('1.06%')

    const yieldBearingTokensAprDisplayed = result.current.yieldBearingTokensAprDisplayed
    expect(yieldBearingTokensAprDisplayed).toBe('0.01064005055663294')
    expect(fNum('apr', yieldBearingTokensAprDisplayed)).toBe('1.06%')

    const totalBaseDisplayed = result.current.totalBaseDisplayed
    expect(totalBaseDisplayed).toBe('0.02313540147234497')
    expect(fNum('apr', totalBaseDisplayed)).toBe('2.31%') // 0.02 + 1.23 + 1.06  = 2.31

    const extraBalApr = result.current.extraBalAprDisplayed
    expect(extraBalApr.toFixed()).toBe('0.01841046461073296')
    expect(fNum('apr', extraBalApr)).toBe('1.84%')

    const maxVeBalApr = result.current.maxVeBalDisplayed
    expect(maxVeBalApr.toFixed()).toBe('0.04154586608307793')
    expect(fNum('apr', maxVeBalApr)).toBe('4.15%') // 2.31 + 1.84 = 4.15
  })
})
