import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { Pool } from './PoolProvider'
import { PoolListItem } from './pool.types'
import { parseUnits } from 'viem'
import { BPT_DECIMALS } from './pool.constants'
import { HumanAmount } from '@balancer/sdk'
import { GqlPoolStakingType } from '@/lib/shared/services/api/generated/graphql'

export function calcStakedBalance(pool: Pool | PoolListItem): HumanAmount {
  const userBalance = pool.userBalance
  if (!userBalance) return '0'

  return safeSum(
    userBalance.stakedBalances.map(stakedBalance => bn(stakedBalance.balance))
  ) as HumanAmount
}

export function calcStakedBalanceUsd(pool: Pool): number {
  const userBalance = pool.userBalance
  if (!userBalance) return 0

  return Number(
    safeSum(userBalance.stakedBalances.map(stakedBalance => bn(stakedBalance.balanceUsd)))
  )
}

export function calcRawStakedBalance(pool: Pool): bigint {
  return parseUnits(calcStakedBalance(pool), BPT_DECIMALS)
}

export function calcTotalBalance(pool: Pool | PoolListItem): HumanAmount {
  const userBalance = pool.userBalance
  if (!userBalance) return '0'

  return userBalance.totalBalance as HumanAmount
}

export function calcWalletBalance(pool: Pool): HumanAmount {
  const userBalance = pool.userBalance
  if (!userBalance) return '0'

  return userBalance.walletBalance as HumanAmount
}

export function calcWalletBalanceUsd(pool: Pool): number {
  const userBalance = pool.userBalance
  if (!userBalance) return 0

  return userBalance.walletBalanceUsd
}

export function calcRawWalletBalance(pool: Pool): bigint {
  return parseUnits(calcWalletBalance(pool), BPT_DECIMALS)
}

export function calcTotalBalanceUsd(pool: Pool | PoolListItem): number {
  const userBalance = pool.userBalance
  if (!userBalance) return 0

  return userBalance.totalBalanceUsd
}

export function calcRawTotalBalance(pool: Pool): bigint {
  return parseUnits(calcTotalBalance(pool), BPT_DECIMALS)
}

/*
   The api provides staked balances tha, for now, we don't fetch onchain (AURA, FARMING, etc.)
   We need this to use this "non gauge staked balance" in the totalBalance calculation
*/
export function calcNonGaugeStakedBalance(pool: Pool): number {
  const userBalance = pool.userBalance
  if (!userBalance) return 0

  const nonGaugeStakedBalances = userBalance.stakedBalances
    .filter(balance => balance.stakingType !== GqlPoolStakingType.Gauge)
    .map(stakedBalance => stakedBalance.balance)

  return Number(safeSum(nonGaugeStakedBalances))
}

export function hasTotalBalance(pool: Pool) {
  return bn(calcTotalBalance(pool)).gt(0)
}
