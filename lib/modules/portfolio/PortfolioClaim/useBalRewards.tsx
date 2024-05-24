import { getChainId } from '@/lib/config/app.config'
import networkConfigs from '@/lib/config/networks'
import { bn } from '@/lib/shared/utils/numbers'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'
import { BPT_DECIMALS } from '../../pool/pool.constants'
import { PoolListItem } from '../../pool/pool.types'
import { getPoolsByGaugesMap } from '../../pool/pool.utils'
import { useTokens } from '../../tokens/TokensProvider'
import { AbiMap } from '../../web3/contracts/AbiMap'
import { useUserAccount } from '../../web3/UserAccountProvider'

export interface BalTokenReward {
  balance: bigint
  decimals: number
  humanBalance: string
  gaugeAddress: string
  pool: PoolListItem
  tokenAddress: Address
  fiatBalance: BigNumber
}

export type BalTokenRewardsResult = ReturnType<typeof useBalTokenRewards>

export function useBalTokenRewards(pools: PoolListItem[]) {
  const { userAddress, isConnected } = useUserAccount()
  const { priceFor } = useTokens()

  // Get list of all reward tokens from provided pools
  const poolByGaugeMap = useMemo(() => {
    return getPoolsByGaugesMap(pools)
  }, [pools])

  const balIncentivesRequests =
    Object.keys(poolByGaugeMap).map(gaugeAddress => {
      const pool = poolByGaugeMap[gaugeAddress] as PoolListItem
      return {
        abi: AbiMap['balancer.gaugeV5'],
        address: gaugeAddress as Address,
        functionName: 'claimable_tokens',
        args: [(userAddress || '') as Address],
        chainId: getChainId(pool.chain),
      }
    }) || []

  const { data, refetch, isLoading } = useReadContracts({
    contracts: balIncentivesRequests,
    query: { enabled: isConnected },
  })

  // Bal incentives
  const balRewardsData = (data || [])
    .map((data, i) => {
      if (data.status === 'failure') return // Discard failed requests
      const balance = data.result as bigint
      if (!balance) return // Discard pool without claimable balance
      const pool = pools[i]
      const gaugeAddress = balIncentivesRequests[i].address as Address
      const balTokenAddress = networkConfigs[pool.chain].tokens.addresses.bal
      const tokenPrice = balTokenAddress ? priceFor(balTokenAddress, pool.chain) : 0
      const fiatBalance = tokenPrice
        ? bn(formatUnits(balance, BPT_DECIMALS)).multipliedBy(tokenPrice)
        : bn(0)
      const reward: BalTokenReward = {
        gaugeAddress,
        pool,
        balance,
        // Bal amounts always have 18 decimals
        decimals: BPT_DECIMALS,
        humanBalance: formatUnits(balance, BPT_DECIMALS) || '0',
        fiatBalance,
        tokenAddress: networkConfigs[pool.chain].tokens.addresses.bal,
      }
      return reward
    })
    .filter(item => item !== undefined) as BalTokenReward[]

  return {
    balRewardsData,
    refetchBalRewards: refetch,
    isLoadingBalRewards: isLoading,
  }
}
