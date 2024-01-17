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

type OnchainBalanceResponse = {
  status: string
  result?: bigint
  error?: Error
}

function mergeOnchainPoolBalanceData(
  pools: Pool[],
  ocUnstakedBalances: OnchainBalanceResponse[],
  ocStakedBalances: OnchainBalanceResponse[],
  priceFor: (address: string, chain: GqlChain) => number
) {
  return pools.map((pool, i) => {
    if (!ocUnstakedBalances.length || !ocStakedBalances.length) return pool

    const ocUnstakedBalanceInt = ocUnstakedBalances[i].result || 0n
    const hasOcUnstakedBalance = !!ocUnstakedBalances[i].result
    const unstakedBalance = hasOcUnstakedBalance
      ? formatUnits(ocUnstakedBalanceInt, BPT_DECIMALS)
      : pool.userBalance?.walletBalance || '0'

    const ocStakedBalanceInt = ocStakedBalances[i].result || 0n
    const hasOcStakedBalance = !!ocStakedBalances[i].result
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
    refetch: refetchedStakedBalances,
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

  async function refetch() {
    return Promise.all([refetchedStakedBalances(), refetchUnstakedBalances()])
  }

  const isLoading = isLoadingStakedPoolBalances || isLoadingUnstakedPoolBalances

  // the typecasting to unknown is required as the wagmi hook is
  // not type inferring appropriately
  const enrichedPools = mergeOnchainPoolBalanceData(
    pools,
    unstakedPoolBalances as unknown as OnchainBalanceResponse[],
    stakedPoolBalances as unknown as OnchainBalanceResponse[],
    priceFor
  )

  return {
    data: enrichedPools,
    isLoading,
    refetchUnstakedBalances,
    refetchedStakedBalances,
    refetch,
  }
}
