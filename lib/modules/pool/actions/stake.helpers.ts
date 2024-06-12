import { bn } from '@/lib/shared/utils/numbers'
import { Pool } from '../PoolProvider'
import { Address } from 'viem'
import { HumanAmount } from '@balancer/sdk'
import { isClaimableGauge } from '../pool.helpers'
import {
  GqlPoolStakingType,
  GqlUserStakedBalance,
} from '@/lib/shared/services/api/generated/graphql'
import { getGaugeStakedBalance, calcTotalStakedBalance } from '../user-balance.helpers'

// eslint-disable-next-line max-len
export const migrateStakeTooltipLabel = `veBAL gauges are the mechanism to distribute BAL liquidity incentives following community voting.
The gauge where you have staked your LP tokens has been deprecated.
So it's likely best for you to migrate to the new gauge in order to get future BAL liquidity incentives.`

export type UnstakeQuote = {
  gaugeAddress: Address
  amountOut: HumanAmount
}

/*
  If the user has non-preferential staked balance it returns the non preferential unstake data
  If not, it returns the preferential unstake data
*/
export function getUnstakeQuote(pool: Pool): UnstakeQuote {
  if (hasNonPreferentialStakedBalance(pool)) {
    const { nonPreferentialGaugeAddress, nonPreferentialStakedBalance } =
      findFirstNonPreferentialStaking(pool)
    return {
      gaugeAddress: nonPreferentialGaugeAddress as Address,
      amountOut: nonPreferentialStakedBalance as HumanAmount,
    }
  }

  const preferentialGaugeAddress = pool.staking?.gauge?.id as Address
  return {
    gaugeAddress: preferentialGaugeAddress,
    amountOut: getGaugeStakedBalance(pool, preferentialGaugeAddress) as HumanAmount,
  }
}

export function hasNonPreferentialStakedBalance(pool: Pool): boolean {
  return filterNonPreferentialStakingWithBalance(pool).length > 0
}

export function findFirstNonPreferentialStakedWithBalance(
  pool: Pool
): GqlUserStakedBalance | undefined {
  const found = filterNonPreferentialStakingWithBalance(pool)
  if (found.length === 0) return undefined
  return found[0]
}

export function findFirstNonPreferentialStaking(pool: Pool) {
  const nonPreferentialStaking = findFirstNonPreferentialStakedWithBalance(pool)

  if (!nonPreferentialStaking) {
    throw new Error('Non preferential staking gauge not found in user balance')
  }

  const nonPreferentialStakedBalance = nonPreferentialStaking.balance || '0'
  const nonPreferentialGaugeAddress = nonPreferentialStaking.stakingId

  const nonPreferentialGauge = pool.staking?.gauge?.otherGauges?.find(
    otherGauge => otherGauge.id === nonPreferentialGaugeAddress
  )

  if (!nonPreferentialGauge) throw new Error('Non preferential gauge not found in other gauges')

  const isClaimable = isClaimableGauge(nonPreferentialGauge, pool.chain)

  return {
    nonPreferentialStakedBalance,
    nonPreferentialGaugeAddress,
    isClaimable,
  }
}

/*
  This is a very rare edge case that should not happen to any user
*/
export function hasMultipleNonPreferentialStakedBalance(pool: Pool): boolean {
  return filterNonPreferentialStakingWithBalance(pool).length > 1
}

function filterNonPreferentialStakingWithBalance(pool: Pool): GqlUserStakedBalance[] {
  if (!pool.userBalance) return []

  const found = pool.userBalance.stakedBalances.filter(
    stakedBalance =>
      stakedBalance.stakingType === GqlPoolStakingType.Gauge &&
      stakedBalance.stakingId !== pool.staking?.gauge?.id &&
      bn(stakedBalance.balance).gt(0)
  )
  return found
}
