import { testHook } from '@/test/utils/custom-renderers'
import { useAprTooltip } from './useAprTooltip'
import { GqlBalancePoolAprItem, GqlPoolApr } from '../services/api/generated/graphql'
import { fNum } from '../utils/numbers'

const aprItems = [
  {
    title: 'rETH APR',
    apr: {
      total: '0.007561511267738821',
    },
  },
  {
    title: 'BAL reward APR',
    apr: {
      __typename: 'GqlPoolAprRange',
      min: '0.0179827288863146',
      max: '0.04495682221578651',
    },
  },
  {
    title: 'Swap fees APR',
    apr: {
      total: '0.000007489453040656273',
    },
  },
] as unknown as GqlBalancePoolAprItem[]

const apr = {
  apr: {
    __typename: 'GqlPoolAprRange',
    min: '0.02555172960709408',
    max: '0.052525822936565984',
  },
  hasRewardApr: true,
  thirdPartyApr: {
    __typename: 'GqlPoolAprRange',
    min: '0',
    max: '0',
  },
  nativeRewardApr: {
    __typename: 'GqlPoolAprRange',
    min: '0.0179827288863146',
    max: '0.04495682221578651',
  },
  swapApr: '0.000007489453040656273',
  items: [
    {
      title: 'rETH APR',
      apr: {
        total: '0.007561511267738821',
      },
    },
    {
      title: 'BAL reward APR',
      apr: {
        min: '0.0179827288863146',
        max: '0.04495682221578651',
      },
    },
    {
      title: 'Swap fees APR',
      apr: {
        total: '0.000007489453040656273',
      },
    },
  ],
} as unknown as GqlPoolApr

const vebalBoost = undefined

test('useAprTooltip', () => {
  const { result } = testHook(() => useAprTooltip({ aprItems, apr, vebalBoost }))

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
  expect(fNum('apr', maxVeBalApr)).toBe('5.25%') // 2.56 + 2.70 = 5.26 --> there's a rounding error here
})
