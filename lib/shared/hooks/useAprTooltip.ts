import {
  GqlBalancePoolAprItem,
  GqlPoolApr,
  GqlPoolAprRange,
  GqlPoolAprTotal,
} from '../services/api/generated/graphql'
import { useThemeColorMode } from '../services/chakra/useThemeColorMode'
import { bn, isZero, safeSum } from '../utils/numbers'

export const swapFeesTooltipText = `LPs get swap fees anytime a swap is routed through this pool.
These fees automatically accumulate into the LPs position, so there is no need to periodically claim.`

export const baseAprTooltipText = `The base APR all stakers in this pool get (determined by weekly gauge voting).
In addition, veBAL holders can get an extra boost of up to 2.5x.`

export const inherentTokenYieldTooltipText = `Inherent token yield,
 acccounting for the token's share of the overall pool,
 minus any protocol fees.`

export const extraBalTooltipText = `veBAL holders can get an extra boost of up to 2.5x on their staking yield.
The more veBAL held, the higher the boost.`

function absMaxApr(apr: GqlPoolApr, boost?: number) {
  if (apr.apr.__typename === 'GqlPoolAprRange') {
    if (boost && boost > 1 && apr.nativeRewardApr.__typename === 'GqlPoolAprRange') {
      const boostedNativeRewardApr = bn(apr.nativeRewardApr.min).times(boost)
      return bn(apr.apr.min).minus(apr.nativeRewardApr.min).plus(boostedNativeRewardApr)
    }

    return bn(apr.apr.max)
  }

  return bn(apr.apr.total)
}

export function useAprTooltip({
  apr,
  aprItems,
  vebalBoost,
}: {
  aprItems: GqlBalancePoolAprItem[]
  apr: GqlPoolApr
  vebalBoost?: number
}) {
  const colorMode = useThemeColorMode()

  // Swap fees
  const swapFee = aprItems.find(item => item.title === 'Swap fees APR')
  const swapFeesDisplayed = swapFee ? (swapFee.apr as GqlPoolAprTotal).total : '0'

  // Yield bearing tokens
  const yieldBearingTokens = aprItems.filter(item => {
    return item && item.title.indexOf('reward') === -1 && item.title.indexOf('Swap fees') === -1
  })

  const yieldBearingTokensDisplayed = yieldBearingTokens.map(item => ({
    title: item.title.replace(' APR', ''),
    apr: (item.apr as GqlPoolAprTotal).total,
  }))

  const yieldBearingTokensAprDisplayed = yieldBearingTokensDisplayed.reduce(
    (acc, item) => safeSum([item.apr, acc]),
    '0'
  )

  // Staking incentives
  const stakingIncentives = aprItems.filter(item => {
    return item && item.title.indexOf('reward') > -1 && item.title.indexOf('BAL reward') === -1
  })

  const stakingIncentivesDisplayed = stakingIncentives.map(item => ({
    title: item.title.replace(' reward APR', ''),
    apr: (item.apr as GqlPoolAprTotal).total,
  }))

  // Bal Reward
  const balReward = aprItems.find(item => item.title === 'BAL reward APR')

  const maxVeBalDisplayed = balReward ? absMaxApr(apr, vebalBoost) : bn(0)

  const totalBaseDisplayed = apr.apr.__typename === 'GqlPoolAprRange' ? apr.apr.min : apr.apr.total

  const extraBalAprDisplayed = balReward ? maxVeBalDisplayed.minus(totalBaseDisplayed) : bn(0)

  if (balReward) {
    stakingIncentivesDisplayed.push({
      title: 'BAL',
      apr: (balReward.apr as GqlPoolAprRange).min,
    })
  }

  const stakingIncentivesAprDisplayed = stakingIncentivesDisplayed.reduce(
    (acc, item) => safeSum([item.apr, acc]),
    '0'
  )

  const isSwapFeePresent = !isZero(swapFeesDisplayed)
  const isYieldPresent = !isZero(yieldBearingTokensAprDisplayed)
  const isStakingPresent = !isZero(stakingIncentivesAprDisplayed)

  const subitemPopoverAprItemProps = {
    pt: 2,
    backgroundColor: 'background.level1',
    fontWeight: 500,
    fontColor: colorMode == 'light' ? 'gray.600' : 'gray.400',
  }

  return {
    totalBaseDisplayed,
    extraBalAprDisplayed,
    yieldBearingTokensAprDisplayed,
    stakingIncentivesAprDisplayed,
    swapFeesDisplayed,
    isSwapFeePresent,
    isYieldPresent,
    isStakingPresent,
    maxVeBalDisplayed,
    yieldBearingTokensDisplayed,
    stakingIncentivesDisplayed,
    subitemPopoverAprItemProps,
    balReward,
  }
}
