/* eslint-disable react-hooks/exhaustive-deps */
import { useReadContracts } from 'wagmi'
import { Address } from 'viem'
import {
  balancerV2GaugeV5Abi,
  balancerV2WeightedPoolV4Abi,
} from '../../web3/contracts/abi/generated'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { formatUnits, zeroAddress } from 'viem'
import { GqlPoolUserBalance } from '@/lib/shared/services/api/generated/graphql'
import { bn } from '@/lib/shared/utils/numbers'
import { calcBptPrice } from '../pool.helpers'
import { Pool } from '../PoolProvider'
import { BPT_DECIMALS } from '../pool.constants'
import { useEffect } from 'react'
import { getChainId } from '@/lib/config/app.config'
import { captureNonFatalError } from '@/lib/shared/utils/query-errors'
import { ReadContractsErrorType } from 'wagmi/actions'

/**
 * Overwrites the pool's userBalance with onchain data.
 *
 * Needs to be an overwrite rather than a merge because figuring out if an
 * onchain result is correct over the API result is too complicated. e.g. in the
 * stakedBalance case, we allow failures, so that the array is the correct size. We know
 * there will be failures for pools that don't have gauges. If they don't have
 * gauges then they don't have staked balances, so we can safely overwrite
 * with a 0 balance.
 */
function overwriteOnchainPoolBalanceData(
  pools: Pool[],
  ocUnstakedBalances: bigint[],
  ocStakedBalances: (bigint | null)[]
) {
  return pools.map((pool, i) => {
    if (!ocUnstakedBalances.length || !ocStakedBalances.length) return pool

    const ocUnstakedBalanceInt = BigInt(ocUnstakedBalances[i]) // BigInt casting here is needed because, weirdly, result can be a string of 0.
    const unstakedBalance = formatUnits(ocUnstakedBalanceInt, BPT_DECIMALS)

    const ocStakedBalanceInt = BigInt(ocStakedBalances[i] || 0)
    const stakedBalance = formatUnits(ocStakedBalanceInt, BPT_DECIMALS)

    const ocTotalBalanceInt = ocStakedBalanceInt + ocUnstakedBalanceInt
    const totalBalance = formatUnits(ocTotalBalanceInt, BPT_DECIMALS)

    const bptPrice = calcBptPrice(pool.dynamicData.totalLiquidity, pool.dynamicData.totalShares)

    const userBalance: GqlPoolUserBalance = {
      __typename: 'GqlPoolUserBalance',
      ...(pool.userBalance || {}),
      stakedBalance,
      stakedBalanceUsd: bn(stakedBalance).times(bptPrice).toNumber(),
      walletBalance: unstakedBalance,
      walletBalanceUsd: bn(unstakedBalance).times(bptPrice).toNumber(),
      totalBalance,
      totalBalanceUsd: bn(totalBalance).times(bptPrice).toNumber(),
    }

    return {
      ...pool,
      userBalance,
    }
  })
}

export function useOnchainUserPoolBalances(pools: Pool[] = []) {
  const { userAddress, isConnected } = useUserAccount()

  const {
    data: unstakedPoolBalances = [],
    isLoading: isLoadingUnstakedPoolBalances,
    refetch: refetchUnstakedBalances,
    error: unstakedPoolBalancesError,
  } = useReadContracts({
    allowFailure: false,
    query: {
      enabled: isConnected,
    },
    contracts: pools.map(
      pool =>
        ({
          abi: balancerV2WeightedPoolV4Abi,
          address: pool.address as Address,
          functionName: 'balanceOf',
          args: [userAddress],
          chainId: getChainId(pool.chain),
        } as const)
    ),
  })

  const {
    data: stakedPoolBalances = [],
    isLoading: isLoadingStakedPoolBalances,
    refetch: refetchedStakedBalances,
    error: stakedPoolBalancesError,
  } = useReadContracts({
    query: { enabled: isConnected },
    contracts: pools.map(
      pool =>
        ({
          abi: balancerV2GaugeV5Abi,
          // We have to let the contract call fail if there is no gauge address so the array is the right size.
          address: (pool.staking?.gauge?.gaugeAddress as Address) || zeroAddress,
          functionName: 'balanceOf',
          args: [userAddress],
          chainId: getChainId(pool.chain),
        } as const)
    ),
  })

  async function refetch() {
    return Promise.all([refetchUnstakedBalances(), refetchedStakedBalances()])
  }

  const isLoading = isLoadingUnstakedPoolBalances || isLoadingStakedPoolBalances

  const enrichedPools = overwriteOnchainPoolBalanceData(
    pools,
    unstakedPoolBalances,
    stakedPoolBalances.map(b => b.result || null)
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
