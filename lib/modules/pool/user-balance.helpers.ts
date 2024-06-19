import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { Pool } from './PoolProvider'
import { PoolListItem } from './pool.types'
import { parseUnits } from 'viem'
import { BPT_DECIMALS } from './pool.constants'
import { HumanAmount } from '@balancer/sdk'
import { GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'

export function calcTotalStakedBalance(pool: Pool | PoolListItem): HumanAmount {
  const userBalance = pool.userBalance
  if (!userBalance) return '0'

  return safeSum(
    userBalance.stakedBalances.map(stakedBalance => bn(stakedBalance.balance))
  ) as HumanAmount
}

export function calcTotalStakedBalanceUsd(pool: Pool): number {
  const userBalance = pool.userBalance
  if (!userBalance) return 0

  return Number(
    safeSum(userBalance.stakedBalances.map(stakedBalance => bn(stakedBalance.balanceUsd)))
  )
}

export function calcTotalStakedBalanceInt(pool: Pool): bigint {
  return parseUnits(calcTotalStakedBalance(pool), BPT_DECIMALS)
}

export function getUserTotalBalance(pool: Pool | PoolListItem): HumanAmount {
  const userBalance = pool.userBalance
  if (!userBalance) return '0'

  return userBalance.totalBalance as HumanAmount
}

export function getUserWalletBalance(pool: Pool): HumanAmount {
  const userBalance = pool.userBalance
  if (!userBalance) return '0'

  return userBalance.walletBalance as HumanAmount
}

export function getUserWalletBalanceUsd(pool: Pool): number {
  const userBalance = pool.userBalance
  if (!userBalance) return 0

  return userBalance.walletBalanceUsd
}

export function getUserWalletBalanceInt(pool: Pool): bigint {
  return parseUnits(getUserWalletBalance(pool), BPT_DECIMALS)
}

export function getUserTotalBalanceUsd(pool: Pool | PoolListItem): number {
  const userBalance = pool.userBalance
  if (!userBalance || !userBalance.totalBalanceUsd) return 0

  return userBalance.totalBalanceUsd
}

export function getUserTotalBalanceInt(pool: Pool): bigint {
  return parseUnits(getUserTotalBalance(pool), BPT_DECIMALS)
}

/*
   The api provides staked balances that, for now, we don't fetch onchain (AURA, FARMING, etc.)
   We need this "non veBal staked balance" in the totalBalance calculation
*/
export function calcNonVeBalStakedBalance(pool: Pool): number {
  const userBalance = pool.userBalance
  if (!userBalance) return 0

  const nonGaugeStakedBalances = userBalance.stakedBalances
    .filter(balance => balance.stakingType !== GqlPoolStakingType.Gauge)
    .map(stakedBalance => stakedBalance.balance)

  return Number(safeSum(nonGaugeStakedBalances))
}

export function hasTotalBalance(pool: Pool) {
  return bn(getUserTotalBalance(pool)).gt(0)
}

export function hasAuraStakedBalance(pool: Pool | PoolListItem): boolean {
  return hasStakedBalanceFor(pool, GqlPoolStakingType.Aura)
}

export function hasBalancerStakedBalance(pool: Pool | PoolListItem): boolean {
  return hasStakedBalanceFor(pool, GqlPoolStakingType.Gauge)
}

export function hasStakedBalanceFor(
  pool: Pool | PoolListItem,
  stakingType: GqlPoolStakingType
): boolean {
  const userBalance = pool.userBalance
  if (!userBalance) return false

  return userBalance.stakedBalances.some(
    balance => balance.stakingType === stakingType && bn(balance.balance).gt(0)
  )
}

export function hasTinyBalance(pool: Pool | PoolListItem, minUsdBalance = 0.01): boolean {
  const userBalance = pool.userBalance
  if (!userBalance) return false
  return bn(getUserTotalBalanceUsd(pool)).lt(minUsdBalance)
}
