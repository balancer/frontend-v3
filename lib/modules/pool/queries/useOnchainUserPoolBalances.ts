/* eslint-disable react-hooks/exhaustive-deps */
import { Address, useContractReads } from 'wagmi'
import {
  balancerV2GaugeV5ABI,
  balancerV2WeightedPoolV4ABI,
} from '../../web3/contracts/abi/generated'
import { useUserAccount } from '../../web3/useUserAccount'
import { formatUnits, zeroAddress } from 'viem'
import { useTokens } from '../../tokens/useTokens'
import { GqlChain, GqlPoolUserBalance } from '@/lib/shared/services/api/generated/graphql'
import { chainToIdMap } from '../pool.utils'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { calcBptPrice } from '../pool.helpers'
import { Pool } from '../usePool'
import { BPT_DECIMALS } from '../pool.constants'
import { useEffect } from 'react'
import { SentryError, ensureError } from '@/lib/shared/utils/errors'

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
  ocStakedBalances: (bigint | null)[],
  priceFor: (address: string, chain: GqlChain) => number
) {
  return pools.map((pool, i) => {
    if (!ocUnstakedBalances.length || !ocStakedBalances.length) return pool

    const ocUnstakedBalanceInt = BigInt(ocUnstakedBalances[i]) // BigInt casting here is needed because, weirdly, result can be a string of 0.
    const unstakedBalance = formatUnits(ocUnstakedBalanceInt, BPT_DECIMALS)

    const ocStakedBalanceInt = BigInt(ocStakedBalances[i] || 0)
    const stakedBalance = formatUnits(ocStakedBalanceInt, BPT_DECIMALS)

    const ocTotalBalanceInt = ocStakedBalanceInt + ocUnstakedBalanceInt
    const totalBalance = formatUnits(ocTotalBalanceInt, BPT_DECIMALS)

    const totalUsdLiquidity = safeSum(
      pool.tokens.map(token => bn(token.balance).times(priceFor(token.address, pool.chain)))
    )
    const bptPrice = calcBptPrice(totalUsdLiquidity, pool.dynamicData.totalShares)

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
  const { priceFor } = useTokens()

  const {
    data: unstakedPoolBalances = [],
    isLoading: isLoadingUnstakedPoolBalances,
    refetch: refetchUnstakedBalances,
    error: unstakedPoolBalancesError,
  } = useContractReads({
    allowFailure: false,
    enabled: isConnected,
    contracts: pools.map(
      pool =>
        ({
          abi: balancerV2WeightedPoolV4ABI,
          address: pool.address as Address,
          functionName: 'balanceOf',
          args: [userAddress],
          chainId: chainToIdMap[pool.chain],
        } as const)
    ),
  })

  const {
    data: stakedPoolBalances = [],
    isLoading: isLoadingStakedPoolBalances,
    refetch: refetchedStakedBalances,
    error: stakedPoolBalancesError,
  } = useContractReads({
    enabled: isConnected,
    contracts: pools.map(
      pool =>
        ({
          abi: balancerV2GaugeV5ABI,
          // We have to let the contract call fail if there is no gauge address so the array is the right size.
          address: (pool.staking?.gauge?.gaugeAddress as Address) || zeroAddress,
          functionName: 'balanceOf',
          args: [userAddress],
          chainId: chainToIdMap[pool.chain],
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
    stakedPoolBalances.map(b => b.result || null),
    priceFor
  )

  useEffect(() => {
    if (unstakedPoolBalancesError || stakedPoolBalancesError) {
      const error = ensureError(unstakedPoolBalancesError || stakedPoolBalancesError)
      console.log(
        'Failed useOnchainUserPoolBalances',
        unstakedPoolBalancesError || stakedPoolBalancesError
      )
      throw new SentryError('Failed useOnchainUserPoolBalances', {
        cause: error,
        context: { extra: { userAddress } },
      })
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
