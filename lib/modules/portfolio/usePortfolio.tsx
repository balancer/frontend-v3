'use client'

import { GetPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { useQuery as useApolloQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { PoolListItem } from '../pool/pool.types'
import { createContext, useMemo } from 'react'
import { useProtocolRewards } from './PortfolioClaim/useProtocolRewards'
import { ClaimableReward, useClaimableBalances } from './PortfolioClaim/useClaimableBalances'
import { BalTokenReward, useBalTokenRewards } from './PortfolioClaim/useBalRewards'
import { bn } from '@/lib/shared/utils/numbers'
import BigNumber from 'bignumber.js'
import { Address } from 'viem'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useUserAccount } from '../web3/useUserAccount'
import { supportedNetworks } from '../web3/Web3Provider'

export interface ClaimableBalanceResult {
  status: 'success' | 'error'
  result: bigint
}

export interface PoolRewardsData extends PoolListItem {
  balReward?: BalTokenReward
  claimableRewards?: ClaimableReward[]
  totalFiatClaimBalance?: BigNumber
}

export type PoolRewardsDataMap = Record<string, PoolRewardsData>

export function getAllGaugesAddressesFromPool(pool: PoolListItem) {
  const arr = []
  const staking = pool.staking

  if (staking?.gauge) {
    if (staking.gauge.version > 1) {
      arr.push(staking.gauge.gaugeAddress)
    }
  }

  if (staking?.gauge?.otherGauges) {
    arr.push(...staking.gauge.otherGauges.filter(g => g.version > 1).map(g => g.gaugeAddress))
  }

  return arr as Address[]
}

export type UsePortfolio = ReturnType<typeof _usePortfolio>

function _usePortfolio() {
  const { userAddress, isConnected } = useUserAccount()

  const { data, loading } = useApolloQuery(GetPoolsDocument, {
    variables: {
      where: {
        userAddress,
        chainIn: supportedNetworks,
      },
    },
    notifyOnNetworkStatusChange: true,
    skip: !isConnected || !userAddress,
  })

  const portfolioData = useMemo(() => {
    if (!isConnected || !userAddress) {
      return {
        pools: [],
        stakedPools: [],
        unstakedPools: [],
        userTotalBalance: bn(0),
      }
    }

    const stakedPools: PoolListItem[] = []
    const unstakedPools: PoolListItem[] = []
    let userTotalBalance = bn(0)

    data?.pools.forEach(pool => {
      const stakedBalance = bn(pool.userBalance?.stakedBalance || 0)
      const poolTotalBalance = bn(pool.userBalance?.totalBalance || 0)
      const unstakedBalance = poolTotalBalance.minus(stakedBalance)
      const isStaked = stakedBalance.gt(0)
      const isUnstaked = unstakedBalance.gt(0)

      if (isStaked) {
        stakedPools.push(pool)
      }
      if (isUnstaked) {
        unstakedPools.push(pool)
      }

      userTotalBalance = userTotalBalance.plus(pool.userBalance?.totalBalanceUsd || 0)
    })

    return {
      pools: data?.pools || [],
      stakedPools,
      unstakedPools,
      userTotalBalance,
    }
  }, [data?.pools, isConnected, userAddress])

  // Bal token rewards
  const { balRewardsData, isLoadingBalRewards } = useBalTokenRewards(
    portfolioData.stakedPools || []
  )

  // Protocol rewards
  const { protocolRewardsData, isLoadingProtocolRewards } = useProtocolRewards()

  // Other tokens rewards
  const { claimableRewards, claimableRewardsByPoolMap, isLoadingClaimableRewards } =
    useClaimableBalances(portfolioData.stakedPools || [])

  const poolRewardsMap = useMemo(() => {
    return portfolioData.stakedPools?.reduce((acc: PoolRewardsDataMap, pool) => {
      const balReward = balRewardsData.find(r => r.pool.id === pool.id)
      const claimableReward = claimableRewardsByPoolMap[pool.id]

      acc[pool.id] = {
        ...pool,
      }

      let totalFiatClaimableBalance = bn(0)
      if (balReward) {
        acc[pool.id].balReward = balReward
        totalFiatClaimableBalance = totalFiatClaimableBalance.plus(balReward.fiatBalance)
      }
      if (claimableReward) {
        acc[pool.id].claimableRewards = claimableReward
        claimableReward.forEach(
          r => (totalFiatClaimableBalance = totalFiatClaimableBalance.plus(r.fiatBalance))
        )
      }

      acc[pool.id].totalFiatClaimBalance = totalFiatClaimableBalance
      return acc
    }, {})
  }, [portfolioData.stakedPools, balRewardsData, claimableRewardsByPoolMap])

  const rewardsByChainMap = useMemo(() => {
    return portfolioData.stakedPools?.reduce((acc: Record<string, PoolRewardsData[]>, pool) => {
      if (!acc[pool.chain]) acc[pool.chain] = []
      acc[pool.chain].push(poolRewardsMap[pool.id])
      return acc
    }, {})
  }, [portfolioData.stakedPools, poolRewardsMap])

  const poolsByChainMap = useMemo(() => {
    return portfolioData.stakedPools?.reduce((acc: Record<string, PoolListItem[]>, pool) => {
      if (!acc[pool.chain]) acc[pool.chain] = []
      acc[pool.chain].push(pool)
      return acc
    }, {})
  }, [portfolioData.stakedPools])

  const totalFiatClaimableBalance = useMemo(() => {
    return portfolioData.stakedPools?.reduce((acc, pool) => {
      return acc.plus(poolRewardsMap[pool.id]?.totalFiatClaimBalance || 0)
    }, bn(0))
  }, [portfolioData.stakedPools, poolRewardsMap])

  const totalFiatClaimableBalanceByChain = useMemo(() => {
    return Object.entries(poolsByChainMap).reduce(
      (acc: Record<string, BigNumber>, [chain, pools]) => {
        const sum = pools.reduce((total, pool) => {
          return total.plus(poolRewardsMap[pool.id]?.totalFiatClaimBalance || 0)
        }, bn(0))

        acc[chain] = sum

        return acc
      },
      {}
    )
  }, [poolsByChainMap, poolRewardsMap])

  const protocolRewardsBalance = useMemo(() => {
    return protocolRewardsData.reduce((acc, reward) => {
      acc = acc.plus(reward.fiatBalance)
      return acc
    }, bn(0))
  }, [protocolRewardsData])

  return {
    portfolioData,
    balRewardsData,
    protocolRewardsData,
    claimableRewards,
    poolRewardsMap,
    poolsByChainMap,
    totalFiatClaimableBalance,
    totalFiatClaimableBalanceByChain,
    protocolRewardsBalance,
    rewardsByChainMap,
    isLoadingBalRewards,
    isLoadingProtocolRewards,
    isLoadingClaimableRewards,
    isLoadingPortfolio: loading,
    isLoadingClaimPoolData: isLoadingBalRewards || isLoadingClaimableRewards,
  }
}

export const PortfolioContext = createContext<UsePortfolio | null>(null)

interface PortfolioProviderProps {
  children: React.ReactNode
}

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  const hook = _usePortfolio()
  return <PortfolioContext.Provider value={hook}>{children}</PortfolioContext.Provider>
}

export const usePortfolio = (): UsePortfolio => useMandatoryContext(PortfolioContext, 'Provider')
