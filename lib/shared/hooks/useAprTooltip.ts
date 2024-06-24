import { GqlPoolAprItem, GqlPoolAprItemType } from '../services/api/generated/graphql'
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

export const lockingIncentivesTooltipText = `Special incentives for liquidity providers who lock 
their Balancer ve8020 pool tokens.`

export const votingIncentivesTooltipText = `To get voting incentives from Hidden Hand, 
you must hold veBAL and have active votes for vote-incentivized pools in the weekly gauge vote. 
The APR listed is the average. Your incentives will be based on your veBAL voting weight vs other voters.`

const stakingBalTooltipText = `The base APR all stakers in this pool get (determined by weekly gauge voting). 
In addition, veBAL holders can get an extra boost of up to 2.5x.`

const stakingTokenTooltipText = '3rd party incentives (outside the veBAL system)'

function absMaxApr(aprItems: GqlPoolAprItem[], boost?: number) {
  return aprItems.reduce((acc, item) => {
    if (item.title !== 'BAL reward APR') {
      return acc.plus(bn(item.apr))
    }

    return acc.plus(bn(item.apr).times(boost && boost > 1 ? boost : 2.5))
  }, bn(0))
}

export function useAprTooltip({
  aprItems,
  numberFormatter,
  vebalBoost,
}: {
  aprItems: GqlPoolAprItem[]
  numberFormatter: (value: string) => BigNumber
  vebalBoost?: number
}) {
  const colorMode = useThemeColorMode()

  // There may be two instances of 'BAL reward APR'. We need to remove the second one
  let hasBalReward = false
  const filteredAprItems = aprItems.filter(item => {
    if (item.title === 'BAL reward APR') {
      if (hasBalReward) {
        return false
      }

      hasBalReward = true
    }

    return true
  })

  // Swap fees
  const swapFee = filteredAprItems.find(item => item.type === GqlPoolAprItemType.SwapFee)
  const swapFeesDisplayed = numberFormatter(swapFee ? swapFee.apr.toString() : '0')

  // Yield bearing tokens
  const yieldBearingTokens = filteredAprItems.filter(item => {
    return item.type === GqlPoolAprItemType.IbYield
  })

  const yieldBearingTokensDisplayed = yieldBearingTokens.map(item => ({
    title: item.title.replace(' APR', ''),
    apr: numberFormatter(item.apr.toString()),
  }))

  const yieldBearingTokensAprDisplayed = yieldBearingTokensDisplayed.reduce(
    (acc, item) => acc.plus(item.apr),
    bn(0)
  )

  // Staking incentives
  const stakingIncentives = filteredAprItems.filter(item => {
    return item.type === GqlPoolAprItemType.Staking && item.title.indexOf('BAL reward') === -1
  })

  const stakingIncentivesDisplayed = stakingIncentives.map(item => ({
    title: item.title.replace(' reward APR', ''),
    apr: numberFormatter(item.apr.toString()),
    tooltipText: stakingTokenTooltipText,
  }))

  const votingApr = filteredAprItems.find(item => item.type === GqlPoolAprItemType.Voting)
  const votingAprDisplayed = numberFormatter(votingApr ? votingApr.apr.toString() : '0')

  const lockingApr = filteredAprItems.find(item => item.type === GqlPoolAprItemType.Locking)
  const lockingAprDisplayed = numberFormatter(lockingApr ? lockingApr.apr.toString() : '0')

  // Bal Reward
  const balReward = filteredAprItems.find(item => item.title === 'BAL reward APR')

  const maxVeBal = balReward ? absMaxApr(filteredAprItems, vebalBoost) : bn(0)
  const maxVeBalDisplayed = numberFormatter(maxVeBal.toString())

  const totalBase = filteredAprItems
    .filter(
      item => item.type !== GqlPoolAprItemType.Voting && item.type !== GqlPoolAprItemType.Locking
    )
    .reduce((acc, item) => acc.plus(item.apr), bn(0))
  const totalBaseDisplayed = numberFormatter(totalBase.toString())

  const totalCombined = filteredAprItems.reduce((acc, item) => acc.plus(item.apr), bn(0))
  const totalCombinedDisplayed = numberFormatter(totalCombined.toString())

  const extraBalAprDisplayed = balReward ? maxVeBalDisplayed.minus(totalBaseDisplayed) : bn(0)

  if (balReward) {
    stakingIncentivesDisplayed.push({
      title: 'BAL',
      apr: numberFormatter(balReward.apr.toString()),
      tooltipText: stakingBalTooltipText,
    })
  }

  const stakingIncentivesAprDisplayed = stakingIncentivesDisplayed.reduce(
    (acc, item) => acc.plus(item.apr),
    bn(0)
  )

  const isSwapFeePresent = !swapFeesDisplayed.isZero()
  const isYieldPresent = !yieldBearingTokensAprDisplayed.isZero()
  const isStakingPresent = !stakingIncentivesAprDisplayed.isZero()

  const isVotingPresent = !votingAprDisplayed.isZero()
  const isLockingAprPresent = !lockingAprDisplayed.isZero()

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
    votingAprDisplayed,
    lockingAprDisplayed,
    isVotingPresent,
    isLockingAprPresent,
    subitemPopoverAprItemProps,
    balReward,
    maxVeBal,
    totalBase,
    totalCombined,
    totalCombinedDisplayed,
  }
}
