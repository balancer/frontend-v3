import { bn } from '@/lib/shared/utils/numbers'
import { Pool } from '../PoolProvider'
import { Address } from 'viem'
import { HumanAmount } from '@balancer/sdk'
import { isClaimableGauge } from '../pool.helpers'
import { GqlPoolStakingOtherGauge } from '@/lib/shared/services/api/generated/graphql'

export type UnstakeQuote = {
  gaugeAddress: Address
  amountOut: HumanAmount
}

/*
  // TODO: we will deal with non-preferential gauges in an incoming PR
  If the user has non-preferential staked balance it returns the non preferential unstake data
  If not, it returns the preferential unstake data
*/
export function getUnstakeQuote(pool: Pool): UnstakeQuote {
  if (hasNonPreferentialStakedBalance(pool)) {
    const { nonPreferentialGaugeAddress, nonPreferentialStakedBalance } =
      findNonPreferentialStaking(pool)
    return {
      gaugeAddress: nonPreferentialGaugeAddress as Address,
      amountOut: nonPreferentialStakedBalance as HumanAmount,
    }
  }

  return {
    gaugeAddress: pool.staking?.gauge?.id as Address,
    amountOut: pool.userBalance?.stakedBalance as HumanAmount,
  }
}

export function hasNonPreferentialStakedBalance(pool: Pool) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const nonPreferentialStakedBalance = bn(pool.userBalance?.nonPreferentialStakedBalance || '0')
  return nonPreferentialStakedBalance.gt(0)
}

export function findNonPreferentialStaking(pool: Pool) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const nonPreferentialStakedBalance = bn(pool.userBalance?.nonPreferentialStakedBalance || '0')

  //TODO: throw if staked in more than 2 non preferential gauges

  //TODO: fix this when new API schema is deployed
  // Probably we will just find the first other gauge with balance and assume there is no more than one
  const otherGaugeWithBalanceIndex = 0
  const nonPreferentialGauge = pool.staking?.gauge?.otherGauges?.[
    otherGaugeWithBalanceIndex
  ] as GqlPoolStakingOtherGauge
  const nonPreferentialGaugeAddress = nonPreferentialGauge?.gaugeAddress || ''

  const isClaimable = isClaimableGauge(nonPreferentialGauge, pool.chain)

  return {
    nonPreferentialStakedBalance: nonPreferentialStakedBalance.toFixed(),
    nonPreferentialGaugeAddress,
    isClaimable,
  }
}
