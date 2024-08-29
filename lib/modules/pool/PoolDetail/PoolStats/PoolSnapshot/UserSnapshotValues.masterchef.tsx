'use client'

import React, { useMemo } from 'react'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { SECONDS_IN_DAY } from '@/test/utils/numbers'
import { sumBy } from 'lodash'
import { useTokens } from '../../../../tokens/TokensProvider'
import { useClaim } from '../../../actions/claim/ClaimProvider'
import { getTotalAprRaw } from '../../../pool.utils'
import { usePool } from '../../../PoolProvider'
import { bn } from '@/lib/shared/utils/numbers'
import { calcTotalStakedBalanceUsd } from '../../../user-balance.helpers'
import { UserSnapshotValuesContent } from './UserSnapshotValuesContent'

export type PoolMyStatsValues = {
  myLiquidity: number
  myPotentialWeeklyYield: string
  myClaimableRewards: number
}

const POSSIBLE_STAKED_BALANCE_USD = 10000

export function UserSnapshotValues() {
  const { pool, chain, isLoading: isLoadingPool } = usePool()
  const { getToken } = useTokens()

  const {
    isLoading: isLoadingClaiming,
    hasNoRewards,
    balRewards,
    nonBalRewards,
    previewModalDisclosure,
    disabledReason,
    isDisabled,
  } = useClaim()

  // TODO: only uses Balancer rewards rn
  const claimableRewards = [...balRewards, ...nonBalRewards]
  const myClaimableRewards = sumBy(claimableRewards, reward => reward.fiatBalance.toNumber())

  const currentRewards = pool.staking?.gauge?.rewards || []
  const currentRewardsPerWeek = currentRewards.map(reward => {
    return {
      ...reward,
      rewardPerWeek: parseFloat(reward.rewardPerSecond) * SECONDS_IN_DAY * 7,
    }
  })

  const tokens = currentRewardsPerWeek
    .filter(reward => bn(reward.rewardPerSecond).gt(0))
    .map(reward => getToken(reward.tokenAddress, chain)) as GqlToken[]

  const myAprRaw = getTotalAprRaw(pool.dynamicData.aprItems)

  const poolMyStatsValues: PoolMyStatsValues | undefined = useMemo(() => {
    if (pool && pool.userBalance && !isLoadingPool && !isLoadingClaiming) {
      const totalBalanceUsd = pool.userBalance.totalBalanceUsd

      // TODO: only uses Balancer balances rn
      const stakedBalanceUsd = totalBalanceUsd
        ? calcTotalStakedBalanceUsd(pool)
        : POSSIBLE_STAKED_BALANCE_USD

      return {
        // TODO: only uses Balancer balances rn
        myLiquidity: totalBalanceUsd,
        // TODO: only uses Balancer balances rn
        myPotentialWeeklyYield: bn(stakedBalanceUsd)
          .times(bn(bn(myAprRaw).div(100)).div(52))
          .toFixed(2),
        myClaimableRewards: myClaimableRewards,
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pool])

  return (
    <UserSnapshotValuesContent
      poolMyStatsValues={poolMyStatsValues}
      boost={undefined}
      hasNoRewards={hasNoRewards}
      tokens={tokens}
      isDisabled={isDisabled}
      disabledReason={disabledReason}
      modal={previewModalDisclosure}
    />
  )
}
