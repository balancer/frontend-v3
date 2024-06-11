/* eslint-disable react-hooks/exhaustive-deps */
import {
  GqlPoolUserBalance,
  GqlUserStakedBalance,
} from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { captureNonFatalError } from '@/lib/shared/utils/query-errors'
import { HumanAmount } from '@balancer/sdk'
import BigNumber from 'bignumber.js'
import { useEffect } from 'react'
import { ReadContractsErrorType } from 'wagmi/actions'
import { Pool as OriginalPool } from '../PoolProvider'
import { calcBptPriceFor } from '../pool.helpers'
import { calcNonGaugeStakedBalance } from '../userBalance.helpers'
import { GaugeStakedBalancesByPoolId, useUserStakedBalance } from './useUserStakedBalance'
import { UnstakedBalanceByPoolId, useUserUnstakedBalance } from './useUserUnstakedBalance'

type Pool = OriginalPool & {
  nonGaugeStakedBalance?: BigNumber
}

export function useOnchainUserPoolBalances(pools: Pool[] = []) {
  const {
    unstakedBalanceByPoolId,
    isLoading: isLoadingUnstakedPoolBalances,
    refetch: refetchUnstakedBalances,
    error: unstakedPoolBalancesError,
  } = useUserUnstakedBalance(pools)

  const {
    gaugeStakedBalancesByPoolId,
    isLoading: isLoadingStakedPoolBalances,
    refetch: refetchedStakedBalances,
    error: stakedPoolBalancesError,
  } = useUserStakedBalance(pools)

  async function refetch() {
    return Promise.all([refetchUnstakedBalances(), refetchedStakedBalances()])
  }

  const isLoading = isLoadingUnstakedPoolBalances || isLoadingStakedPoolBalances

  const enrichedPools = overwriteOnchainPoolBalanceData(
    pools,
    unstakedBalanceByPoolId,
    gaugeStakedBalancesByPoolId
  )

  useEffect(() => {
    if (stakedPoolBalancesError) {
      captureStakedMulticallError(stakedPoolBalancesError)
    }
    if (unstakedPoolBalancesError) {
      captureUnstakedMulticallError(unstakedPoolBalancesError)
    }
  }, [unstakedPoolBalancesError, stakedPoolBalancesError])

  return {
    data: enrichedPools,
    isLoading,
    refetchUnstakedBalances,
    refetchedStakedBalances,
    refetch,
  }
}

function captureStakedMulticallError(stakedPoolBalancesError: ReadContractsErrorType) {
  console.log(
    'Error in stake pool balances multicall in useOnchainUserPoolBalances',
    stakedPoolBalancesError
  )
  captureNonFatalError({
    error: stakedPoolBalancesError,
    errorName: 'UseOnchainUserPoolBalancesError',
    errorMessage: 'Error in staked pool balances multicall',
  })
}

function captureUnstakedMulticallError(unstakedPoolBalancesError: ReadContractsErrorType) {
  console.log(
    'Error in  unstake pool balances multicall in useOnchainUserPoolBalances',
    unstakedPoolBalancesError
  )
  captureNonFatalError({
    error: unstakedPoolBalancesError,
    errorName: 'UseOnchainUserPoolBalancesError',
    errorMessage: 'Error in unstaked pool balances multicall',
  })
}

/**
 * Overwrites the pool's userBalance with onchain data.
 *
 * Needs to be an overwrite rather than a merge because figuring out if an
 * onchain result is correct over the API result is too complicated. e.g. in the
 * stakedBalance case, we allow failures, so that the array is the correct size. We know
 * there will be pools that don't have gauges. If they don't have
 * gauges then they don't have staked balances, so we can safely overwrite
 * with a 0 balance.
 */
function overwriteOnchainPoolBalanceData(
  pools: Pool[],
  ocUnstakedBalances: UnstakedBalanceByPoolId,
  gaugeStakedBalancesByPoolId: GaugeStakedBalancesByPoolId
) {
  return pools.map(pool => {
    if (
      !Object.keys(ocUnstakedBalances).length ||
      !Object.keys(gaugeStakedBalancesByPoolId).length
    ) {
      return pool
    }
    const bptPrice = calcBptPriceFor(pool)

    // Unstaked balances
    const onchainUnstakedBalances = ocUnstakedBalances[pool.id]
    const onchainUnstakedBalance = onchainUnstakedBalances.unstakedBalance as HumanAmount
    const onchainUnstakedBalanceUsd = bn(onchainUnstakedBalance).times(bptPrice).toNumber()

    // Staked balances
    const onchainGaugeStakedBalances = gaugeStakedBalancesByPoolId[pool.id]
    const onchainTotalGaugeStakedBalance = Number(
      safeSum(onchainGaugeStakedBalances.map(stakedBalance => bn(stakedBalance.balance)))
    )

    // Total balances
    const totalBalance =
      calcNonGaugeStakedBalance(pool) + onchainTotalGaugeStakedBalance + onchainUnstakedBalance
    const totalBalanceUsd = Number(bn(totalBalance).times(bptPrice))

    const userBalance: GqlPoolUserBalance = {
      __typename: 'GqlPoolUserBalance',
      ...(pool.userBalance || {}),
      stakedBalances: overrideStakedBalances(pool, gaugeStakedBalancesByPoolId[pool.id]),
      walletBalance: onchainUnstakedBalance,
      walletBalanceUsd: onchainUnstakedBalanceUsd,
      totalBalance,
      totalBalanceUsd,
    }

    return {
      ...pool,
      userBalance,
    }
  })
}

/* Returns a GqlUserStakedBalance[] array by overriding pool.userBalance.stakedBalances with the given onchain gauge staking balances.
 */
function overrideStakedBalances(
  pool: Pool,
  onChainGaugeStakedBalances: GqlUserStakedBalance[]
): GqlUserStakedBalance[] {
  if (!pool.userBalance) return onChainGaugeStakedBalances
  const apiStakedBalances = [...pool.userBalance.stakedBalances]

  onChainGaugeStakedBalances.forEach(onchainStakedBalance => {
    // Index of the onchain gauge in the api staked balances
    const index = apiStakedBalances.findIndex(apiBalance =>
      isSameAddress(apiBalance.stakingId, onchainStakedBalance.stakingId)
    )
    if (index === -1) {
      apiStakedBalances.push(onchainStakedBalance)
    } else {
      apiStakedBalances[index] = onchainStakedBalance
    }
  })
  return apiStakedBalances
}
