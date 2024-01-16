import { Address, useContractReads } from 'wagmi'
import { balancerV2GaugeV5ABI, balancerV2WeightedPoolV4ABI } from '../web3/contracts/abi/generated'
import { useUserAccount } from '../web3/useUserAccount'
import { formatUnits, zeroAddress } from 'viem'
import { useTokens } from '../tokens/useTokens'
import {
  GqlChain,
  GqlPoolUnion,
  GqlPoolUserBalance,
} from '@/lib/shared/services/api/generated/graphql'
import { chainToIdMap } from './pool.utils'
import { bn, safeSum } from '@/lib/shared/utils/numbers'
import BigNumber from 'bignumber.js'
import { calcBptPrice } from './pool.helpers'

type OnchainBalanceResponse = {
  status: string
  result?: bigint
  error?: Error
}

function enrichPools(
  pools: GqlPoolUnion[],
  ocUnstakedBalances: OnchainBalanceResponse[],
  ocStakedBalances: OnchainBalanceResponse[],
  priceFor: (address: string, chain: GqlChain) => number
) {
  return pools.map((pool, i) => {
    if (!ocUnstakedBalances.length || !ocStakedBalances.length) return pool

    const ocUnstakedBalanceInt = ocUnstakedBalances[i].result || 0n
    const unstakedBalance = BigNumber.max(
      formatUnits(ocUnstakedBalanceInt, 18),
      pool.userBalance?.walletBalance || 0
    ).toString()

    const ocStakedBalanceInt = ocStakedBalances[i].result || 0n
    const stakedBalance = BigNumber.max(
      formatUnits(ocStakedBalanceInt, 18),
      pool.userBalance?.stakedBalance || 0
    ).toString()

    const ocTotalBalanceInt = ocStakedBalanceInt + ocUnstakedBalanceInt
    const totalBalance = BigNumber.max(
      formatUnits(ocTotalBalanceInt, 18),
      pool.userBalance?.totalBalance || 0
    ).toString()

    const totalUsdLiquidity = safeSum(pool.tokens.map(token => priceFor(token.address, pool.chain)))
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

export function useOnchainUserPoolBalances(pools: GqlPoolUnion[] = []) {
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
    unstakedPoolBalances as unknown as OnchainBalanceResponse[],
    stakedPoolBalances as unknown as OnchainBalanceResponse[],
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
