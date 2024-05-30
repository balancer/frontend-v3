/* eslint-disable react-hooks/exhaustive-deps */
import { GqlPoolUserBalance } from '@/lib/shared/services/api/generated/graphql'
import { bn } from '@/lib/shared/utils/numbers'
import { captureNonFatalError } from '@/lib/shared/utils/query-errors'
import { HumanAmount } from '@balancer/sdk'
import { useEffect } from 'react'
import { formatUnits } from 'viem'
import { ReadContractsErrorType } from 'wagmi/actions'
import { Pool } from '../PoolProvider'
import { BPT_DECIMALS } from '../pool.constants'
import { calcBptPrice } from '../pool.helpers'
import { StakedBalancesByPoolId, useUserStakedBalance } from './useUserStakedBalance'
import { UnstakedBalanceByPoolId, useUserUnstakedBalance } from './useUserUnstakedBalance'

export function useOnchainUserPoolBalances(pools: Pool[] = []) {
  const {
    unstakedBalanceByPoolId,
    isLoading: isLoadingUnstakedPoolBalances,
    refetch: refetchUnstakedBalances,
    error: unstakedPoolBalancesError,
  } = useUserUnstakedBalance(pools)

  const {
    stakedBalancesByPoolId,
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
    stakedBalancesByPoolId
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
  ocStakedBalances: StakedBalancesByPoolId
) {
  return pools.map((pool, i) => {
    if (!Object.keys(ocUnstakedBalances).length || !Object.keys(ocStakedBalances).length) {
      return pool
    }
    const bptPrice = calcBptPrice(pool.dynamicData.totalLiquidity, pool.dynamicData.totalShares)

    // Unstaked balances
    const poolUnstakedBalance = ocUnstakedBalances[pool.id]
    const unstakedBalance = poolUnstakedBalance.unstakedBalance as HumanAmount
    const unstakedBalanceUsd = bn(unstakedBalance).times(bptPrice).toNumber()

    // Staked balances
    const poolStakedBalances = ocStakedBalances[pool.id]
    const stakedBalance = poolStakedBalances.stakedBalance as HumanAmount //TODO: add third party staked balance from API
    const stakedBalanceUsd = bn(poolStakedBalances.stakedBalanceUsd).toNumber()
    const nonPreferentialStakedBalance =
      poolStakedBalances.nonPreferentialStakedBalance as HumanAmount
    const nonPreferentialStakedBalanceUsd = bn(
      poolStakedBalances.nonPreferentialStakedBalanceUsd
    ).toNumber()

    //Totals
    const totalStakedBalanceRaw =
      BigInt(poolUnstakedBalance.rawUnstakedBalance) + // BigInt casting here is needed because, weirdly, result can be a string of 0.
      poolStakedBalances.rawStakedBalance +
      poolStakedBalances.nonPreferentialRawStakedBalance
    const totalBalance = formatUnits(totalStakedBalanceRaw, BPT_DECIMALS)
    const totalBalanceUsd = bn(totalBalance).times(bptPrice).toNumber()

    // These fields do not exist in API yet but they will be added soon
    type FutureApiFields = {
      nonPreferentialStakedBalance: string
      nonPreferentialStakedBalanceUsd: number
    }
    const userBalance: GqlPoolUserBalance & FutureApiFields = {
      __typename: 'GqlPoolUserBalance',
      ...(pool.userBalance || {}),
      stakedBalance,
      stakedBalanceUsd,
      walletBalance: unstakedBalance,
      walletBalanceUsd: unstakedBalanceUsd,
      totalBalance,
      totalBalanceUsd,
      nonPreferentialStakedBalance,
      nonPreferentialStakedBalanceUsd,
    }

    return {
      ...pool,
      userBalance,
    }
  })
}
