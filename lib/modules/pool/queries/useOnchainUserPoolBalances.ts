/* eslint-disable react-hooks/exhaustive-deps */
import { Address, useContractReads } from 'wagmi'
import {
  balancerV2GaugeV5ABI,
  balancerV2WeightedPoolV4ABI,
} from '../../web3/contracts/abi/generated'
import { useUserAccount } from '../../web3/useUserAccount'
import { formatUnits } from 'viem'
import { useTokens } from '../../tokens/useTokens'
import { GqlChain, GqlPoolUserBalance } from '@/lib/shared/services/api/generated/graphql'
import { chainToIdMap } from '../pool.utils'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import { calcBptPrice } from '../pool.helpers'
import { Pool } from '../usePool'
import { BPT_DECIMALS } from '../pool.constants'
import { useEffect } from 'react'
import { SentryError, ensureError } from '@/lib/shared/utils/errors'

function mergeOnchainPoolBalanceData(
  pools: Pool[],
  ocUnstakedBalances: bigint[],
  ocStakedBalances: bigint[],
  priceFor: (address: string, chain: GqlChain) => number
) {
  return pools.map((pool, i) => {
    if (!ocUnstakedBalances.length || !ocStakedBalances.length) return pool

    const hasOcUnstakedBalance = !!ocUnstakedBalances[i]
    const ocUnstakedBalanceInt = BigInt(ocUnstakedBalances[i] || 0) // BigInt casting here is needed because weirdly result can be a string of 0.
    const unstakedBalance = hasOcUnstakedBalance
      ? formatUnits(ocUnstakedBalanceInt, BPT_DECIMALS)
      : pool.userBalance?.walletBalance || '0'

    const hasOcStakedBalance = !!ocStakedBalances[i]
    const ocStakedBalanceInt = BigInt(ocStakedBalances[i] || 0)
    const stakedBalance = hasOcStakedBalance
      ? formatUnits(ocStakedBalanceInt, BPT_DECIMALS)
      : pool.userBalance?.stakedBalance || '0'

    const ocTotalBalanceInt = ocStakedBalanceInt + ocUnstakedBalanceInt
    const totalBalance =
      hasOcStakedBalance && hasOcUnstakedBalance
        ? formatUnits(ocTotalBalanceInt, BPT_DECIMALS)
        : pool.userBalance?.totalBalance || '0'

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
    allowFailure: false,
    enabled: isConnected,
    contracts: pools.map(
      pool =>
        ({
          enabled: pool.staking?.gauge?.gaugeAddress !== undefined,
          abi: balancerV2GaugeV5ABI,
          address: pool.staking?.gauge?.gaugeAddress as Address,
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

  const enrichedPools = mergeOnchainPoolBalanceData(
    pools,
    unstakedPoolBalances,
    stakedPoolBalances,
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
