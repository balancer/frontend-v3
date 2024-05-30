import { sortBy } from 'lodash'
import {
  GqlBalancePoolAprItem,
  GqlPoolApr,
  GqlPoolAprRange,
  GqlPoolAprTotal,
} from '../services/api/generated/graphql'
import { useThemeColorMode } from '../services/chakra/useThemeColorMode'
import { bn } from '../utils/numbers'
import BigNumber from 'bignumber.js'

export const swapFeesTooltipText = `LPs get swap fees anytime a swap is routed through this pool. 
These fees automatically accumulate into the LPs position, so there is no need to periodically claim.`

export const inherentTokenYieldTooltipText = `Inherent token yield, 
 acccounting for the token's share of the overall pool,
 minus any protocol fees.`

export const extraBalTooltipText = `veBAL holders can get an extra boost of up to 2.5x on their staking yield. 
The more veBAL held, the higher the boost.`

const stakingBalTooltipText = `The base APR all stakers in this pool get (determined by weekly gauge voting). 
In addition, veBAL holders can get an extra boost of up to 2.5x.`

const stakingTokenTooltipText = '3rd party incentives (outside the veBAL system)'

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
  numberFormatter,
  vebalBoost,
}: {
  aprItems: GqlBalancePoolAprItem[]
  apr: GqlPoolApr
  numberFormatter: (value: string) => BigNumber
  vebalBoost?: number
}) {
  const colorMode = useThemeColorMode()

  // Swap fees
  const swapFee = aprItems.find(item => item.title === 'Swap fees APR')
  let swapFeesDisplayed = numberFormatter(swapFee ? (swapFee.apr as GqlPoolAprTotal).total : '0')

  // Yield bearing tokens
  const yieldBearingTokens = aprItems.filter(item => {
    return item && item.title.indexOf('reward') === -1 && item.title.indexOf('Swap fees') === -1
  })

  const yieldBearingTokensDisplayed = yieldBearingTokens.map(item => ({
    title: item.title.replace(' APR', ''),
    apr: numberFormatter((item.apr as GqlPoolAprTotal).total),
  }))

  let yieldBearingTokensAprDisplayed = yieldBearingTokensDisplayed.reduce(
    (acc, item) => acc.plus(item.apr),
    bn(0)
  )

  // Staking incentives
  const stakingIncentives = aprItems.filter(item => {
    return item && item.title.indexOf('reward') > -1 && item.title.indexOf('BAL reward') === -1
  })

  const stakingIncentivesDisplayed = stakingIncentives.map(item => ({
    title: item.title.replace(' reward APR', ''),
    apr: numberFormatter((item.apr as GqlPoolAprTotal).total),
    tooltipText: stakingTokenTooltipText,
  }))

  // Bal Reward
  const balReward = aprItems.find(item => item.title === 'BAL reward APR')

  const maxVeBal = balReward ? absMaxApr(apr, vebalBoost).toString() : '0'
  const maxVeBalDisplayed = numberFormatter(maxVeBal)

  const totalBase = apr.apr.__typename === 'GqlPoolAprRange' ? apr.apr.min : apr.apr.total
  const totalBaseDisplayed = numberFormatter(totalBase)

  const extraBalAprDisplayed = balReward ? maxVeBalDisplayed.minus(totalBaseDisplayed) : bn(0)

  if (balReward) {
    stakingIncentivesDisplayed.push({
      title: 'BAL',
      apr: numberFormatter((balReward.apr as GqlPoolAprRange).min),
      tooltipText: stakingBalTooltipText,
    })
  }

  let stakingIncentivesAprDisplayed = stakingIncentivesDisplayed.reduce(
    (acc, item) => acc.plus(item.apr),
    bn(0)
  )

  const totalBaseDisplayedRoundingError = totalBaseDisplayed.minus(
    swapFeesDisplayed.plus(yieldBearingTokensAprDisplayed).plus(stakingIncentivesAprDisplayed)
  )

  if (!totalBaseDisplayedRoundingError.isZero()) {
    if (!swapFeesDisplayed.isZero()) {
      swapFeesDisplayed = swapFeesDisplayed.plus(totalBaseDisplayedRoundingError)
    }

    if (!yieldBearingTokensAprDisplayed.isZero()) {
      yieldBearingTokensAprDisplayed = yieldBearingTokensAprDisplayed.plus(
        totalBaseDisplayedRoundingError
      )

      const highestYieldBearingToken = sortBy(yieldBearingTokensDisplayed, 'apr').reverse()[0]
      highestYieldBearingToken.apr = highestYieldBearingToken.apr.plus(
        totalBaseDisplayedRoundingError
      )
    } else {
      stakingIncentivesAprDisplayed = stakingIncentivesAprDisplayed.plus(
        totalBaseDisplayedRoundingError
      )

      const highestStakingIncentive = sortBy(stakingIncentivesDisplayed, 'apr').reverse()[0]
      highestStakingIncentive.apr = highestStakingIncentive.apr.plus(
        totalBaseDisplayedRoundingError
      )
    }
  }

  const isSwapFeePresent = !swapFeesDisplayed.isZero()
  const isYieldPresent = !yieldBearingTokensAprDisplayed.isZero()
  const isStakingPresent = !stakingIncentivesAprDisplayed.isZero()

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
    maxVeBal,
    totalBase,
  }
}
