import { sortBy } from 'lodash'
import {
  GqlBalancePoolAprItem,
  GqlPoolApr,
  GqlPoolAprRange,
  GqlPoolAprTotal,
} from '../services/api/generated/graphql'
import { useThemeColorMode } from '../services/chakra/useThemeColorMode'
import { bn } from '../utils/numbers'

const roundToFourDecimals = (numStr: string) => Math.round(parseFloat(numStr) * 10000) / 10000

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
  let swapFeesDisplayed = swapFee ? roundToFourDecimals((swapFee.apr as GqlPoolAprTotal).total) : 0

  // Yield bearing tokens
  const yieldBearingTokens = aprItems.filter(item => {
    return item && item.title.indexOf('reward') === -1 && item.title.indexOf('Swap fees') === -1
  })

  const yieldBearingTokensDisplayed = yieldBearingTokens.map(item => ({
    title: item.title.replace(' APR', ''),
    apr: roundToFourDecimals((item.apr as GqlPoolAprTotal).total),
  }))

  let yieldBearingTokensAprDisplayed = yieldBearingTokensDisplayed.reduce(
    (acc, item) => item.apr + acc,
    0
  )

  // Staking incentives
  const stakingIncentives = aprItems.filter(item => {
    return item && item.title.indexOf('reward') > -1 && item.title.indexOf('BAL reward') === -1
  })

  const stakingIncentivesDisplayed = stakingIncentives.map(item => ({
    title: item.title.replace(' reward APR', ''),
    apr: roundToFourDecimals((item.apr as GqlPoolAprTotal).total),
  }))

  let stakingIncentivesAprDisplayed = stakingIncentivesDisplayed.reduce(
    (acc, item) => item.apr + acc,
    0
  )

  // Bal Reward
  const balReward = aprItems.find(item => item.title === 'BAL reward APR')

  const maxVeBalDisplayed = balReward ? absMaxApr(apr, vebalBoost) : bn(0)

  const totalBaseDisplayed = roundToFourDecimals(
    apr.apr.__typename === 'GqlPoolAprRange' ? apr.apr.min : apr.apr.total
  )

  const extraBalAprDisplayed = balReward ? maxVeBalDisplayed.minus(totalBaseDisplayed) : bn(0)

  if (balReward) {
    stakingIncentivesDisplayed.push({
      title: 'BAL',
      apr: roundToFourDecimals((balReward.apr as GqlPoolAprRange).min),
    })
  }

  const totalBaseDisplayedRoundingError =
    totalBaseDisplayed -
    (swapFeesDisplayed + yieldBearingTokensAprDisplayed + stakingIncentivesAprDisplayed)

  if (totalBaseDisplayedRoundingError != 0) {
    if (swapFeesDisplayed !== 0) {
      swapFeesDisplayed += totalBaseDisplayedRoundingError
    }

    if (yieldBearingTokensAprDisplayed !== 0) {
      yieldBearingTokensAprDisplayed += totalBaseDisplayedRoundingError

      const highestYieldBearingToken = sortBy(yieldBearingTokensDisplayed, 'apr').reverse()[0]
      highestYieldBearingToken.apr += totalBaseDisplayedRoundingError
    } else {
      stakingIncentivesAprDisplayed += totalBaseDisplayedRoundingError

      const highestStakingIncentive = sortBy(stakingIncentivesDisplayed, 'apr').reverse()[0]
      highestStakingIncentive.apr += totalBaseDisplayedRoundingError
    }
  }

  const isSwapFeePresent = swapFeesDisplayed !== 0
  const isYieldPresent = yieldBearingTokensAprDisplayed !== 0
  const isStakingPresent = stakingIncentivesAprDisplayed !== 0

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
