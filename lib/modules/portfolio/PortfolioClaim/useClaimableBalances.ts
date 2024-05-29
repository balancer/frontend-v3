import { getChainId } from '@/lib/config/app.config'
import { bn } from '@/lib/shared/utils/numbers'
import BigNumber from 'bignumber.js'
import { useMemo } from 'react'
import { Address, formatUnits } from 'viem'
import { useReadContracts, type UseReadContractsReturnType } from 'wagmi'
import { PoolListItem } from '../../pool/pool.types'
import { useTokens } from '../../tokens/TokensProvider'
import { AbiMap } from '../../web3/contracts/AbiMap'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { BPT_DECIMALS } from '../../pool/pool.constants'

export interface ClaimableReward {
  balance: bigint
  decimals?: number
  humanBalance: string
  gaugeAddress: string
  pool: PoolListItem
  tokenAddress: Address
  fiatBalance: BigNumber
}

export type ClaimableBalancesResult = ReturnType<typeof useClaimableBalances>

export function useClaimableBalances(pools: PoolListItem[]) {
  const { userAddress, isConnected } = useUserAccount()
  const { priceFor, getToken } = useTokens()

  // Get list of all reward tokens from provided pools
  const rewardTokensList = useMemo(
    () =>
      pools.flatMap(pool => {
        const otherGauges = pool.staking?.gauge?.otherGauges || []
        const rewardTokensAddresses =
          pool.staking?.gauge?.rewards.map(r => ({
            tokenAddress: r.tokenAddress,
            gaugeAddress: pool.staking?.gauge?.gaugeAddress,
          })) || []

        const otherRewardTokensAddresses = otherGauges.flatMap(gauge =>
          gauge.rewards.map(r => {
            return { tokenAddress: r.tokenAddress, gaugeAddress: gauge.gaugeAddress }
          })
        )

        return [...rewardTokensAddresses, ...otherRewardTokensAddresses].map(v => {
          return {
            pool,
            tokenAddress: v.tokenAddress as Address,
            gaugeAddress: v.gaugeAddress as Address,
          }
        })
      }),
    [pools]
  )

  // Get claimable rewards for each reward token
  const poolsRewardTokensRequests = rewardTokensList.map(r => {
    return {
      chainId: getChainId(r.pool.chain),
      id: `${r.gaugeAddress}.${r.tokenAddress}`,
      abi: AbiMap['balancer.gaugeV5'],
      address: r.gaugeAddress,
      functionName: 'claimable_reward',
      args: [userAddress, r.tokenAddress],
    }
  })

  const { data, refetch, isLoading }: UseReadContractsReturnType = useReadContracts({
    contracts: poolsRewardTokensRequests,
    query: { enabled: isConnected },
  })

  // Format claimable rewards data
  const poolRewardTokensData = (data || [])
    .map((data, i) => {
      if (data.status === 'failure') return // Discard calls with error

      const balance = data.result as bigint
      if (!balance) return // Discard calls with no reward

      const gaugeData = rewardTokensList[i]
      const gaugeAddress = gaugeData.gaugeAddress
      const tokenAddress = gaugeData.tokenAddress
      const tokenPrice = priceFor(tokenAddress, gaugeData.pool.chain)
      const decimals = getToken(tokenAddress, gaugeData.pool.chain)?.decimals || BPT_DECIMALS
      const fiatBalance = tokenPrice
        ? bn(formatUnits(balance, decimals)).multipliedBy(tokenPrice)
        : bn(0)

      const reward: ClaimableReward = {
        pool: gaugeData?.pool,
        tokenAddress,
        gaugeAddress,
        balance,
        fiatBalance,
        humanBalance: formatUnits(balance, decimals) || '0',
        decimals,
      }

      return reward
    })
    .filter(Boolean) as ClaimableReward[]

  const claimableRewardsByPoolMap = useMemo(() => {
    return poolRewardTokensData.reduce((acc: Record<string, ClaimableReward[]>, reward) => {
      const poolId = reward.pool.id
      if (!acc[poolId]) acc[poolId] = []
      acc[poolId].push(reward)
      return acc
    }, {})
  }, [poolRewardTokensData])

  return {
    claimableRewardsByPoolMap,
    claimableRewards: poolRewardTokensData,
    refetchClaimableRewards: refetch,
    isLoadingClaimableRewards: isLoading,
  }
}
