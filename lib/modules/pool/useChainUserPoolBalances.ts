import { Address, useContractReads } from 'wagmi'
import { balancerV2GaugeV5ABI, balancerV2WeightedPoolV4ABI } from '../web3/contracts/abi/generated'
import { useUserAccount } from '../web3/useUserAccount'
import { formatUnits, zeroAddress } from 'viem'
import { useTokens } from '../tokens/useTokens'
import { sumBy } from 'lodash'
import { calcBptPriceRaw } from './pool.helpers'
import { GqlChain, GqlPoolWeighted } from '@/lib/shared/services/api/generated/graphql'
import { chainToIdMap } from './pool.utils'

type OnChainBalanceResponse = {
  status: string
  result?: bigint
  error?: Error
}

function enrichPools(
  pools: GqlPoolWeighted[],
  unstakedPoolBalances: OnChainBalanceResponse[],
  stakedPoolBalances: OnChainBalanceResponse[],
  priceFor: (address: string, chain: GqlChain) => number
) {
  return pools.map((pool, i) => {
    if (!unstakedPoolBalances.length || !stakedPoolBalances.length) return pool
    const unstakedPoolBalance = unstakedPoolBalances[i].result
    const stakedPoolBalance = stakedPoolBalances[i].result
    const totalLiquidity = sumBy(pool.tokens, token => {
      return priceFor(token.address, pool.chain) * parseFloat(token.balance)
    })

    const onChainBptPrice = calcBptPriceRaw(totalLiquidity.toString(), pool.dynamicData.totalShares)

    const totalBalance = formatUnits((stakedPoolBalance || 0n) + (unstakedPoolBalance || 0n), 18)
    const stakedBalanceUsd =
      parseFloat(onChainBptPrice) * parseFloat(formatUnits(stakedPoolBalance || 0n, 18))

    const userBalance = {
      ...(pool.userBalance || {}),
      stakedBalance: stakedPoolBalance
        ? formatUnits(stakedPoolBalance || 0n, 18)
        : pool.userBalance?.stakedBalance,
      unstakedPoolBalance,
      totalBalance:
        stakedBalanceUsd && unstakedPoolBalance ? totalBalance : pool.userBalance?.totalBalance,
      stakedBalanceUsd: stakedBalanceUsd ? stakedBalanceUsd : pool.userBalance?.stakedBalanceUsd,
    }

    // apply the changes
    const enrichedPool = {
      ...pool,
      userBalance,
    }

    return enrichedPool
  })
}

export function useChainUserPoolBalances(pools: GqlPoolWeighted[] = []) {
  const { userAddress, isConnected } = useUserAccount()
  const { priceFor } = useTokens()

  const {
    data: unstakedPoolBalances = [],
    isLoading: isLoadingUnstakedPoolBalances,
    refetch: refetchUnstakedPoolBalances,
  } = useContractReads({
    contracts: pools.map(pool => ({
      abi: balancerV2WeightedPoolV4ABI,
      address: pool.address as Address,
      functionName: 'balanceOf',
      args: [userAddress],
      enabled: isConnected,
      chainId: chainToIdMap[pool.chain],
    })),
  })

  const {
    data: stakedPoolBalances = [],
    isLoading: isLoadingStakedPoolBalances,
    refetch: refetchedStakedPoolBalances,
  } = useContractReads({
    contracts: pools.map(pool => ({
      abi: balancerV2GaugeV5ABI,
      address: (pool.staking?.gauge?.gaugeAddress as Address) || zeroAddress,
      functionName: 'balanceOf',
      args: [userAddress],
      enabled: isConnected && pool.staking?.gauge?.gaugeAddress !== undefined,
      chainId: chainToIdMap[pool.chain],
    })),
  })

  function refetchAll() {
    refetchedStakedPoolBalances()
    refetchUnstakedPoolBalances()
  }

  const isLoading = isLoadingStakedPoolBalances || isLoadingUnstakedPoolBalances

  // the typecasting to unknown is required as the wagmi hook is
  // not type inferring appropriately
  const enrichedPools = enrichPools(
    pools,
    unstakedPoolBalances as unknown as OnChainBalanceResponse[],
    stakedPoolBalances as unknown as OnChainBalanceResponse[],
    priceFor
  )
  return {
    enrichedPools,
    isLoading,
    refetchUnstakedPoolBalances,
    refetchedStakedPoolBalances,
    refetchAll,
  }
}
