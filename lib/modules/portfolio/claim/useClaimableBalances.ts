import { PoolListItem } from '../../pool/pool.types'
import { Address } from 'wagmi'
import { useUserAccount } from '../../web3/useUserAccount'
import { useMulticall } from '../../web3/contracts/useMulticall'
import { AbiMap } from '../../web3/contracts/AbiMap'
import { ClaimableBalanceResult } from '../usePortfolio'
import { useMemo } from 'react'
import { formatUnits } from 'viem'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import { useTokens } from '../../tokens/useTokens'
import BigNumber from 'bignumber.js'

export interface ClaimableReward {
  balance: bigint
  decimals?: number
  formattedBalance: string
  gaugeAddress: string
  pool: PoolListItem
  tokenAddress: Address
  fiatBalance: BigNumber
}

export function useClaimableBalances(pools: PoolListItem[]) {
  const { userAddress } = useUserAccount()
  const { priceFor } = useTokens()

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
      chain: r.pool.chain,
      id: `${r.gaugeAddress}.${r.tokenAddress}`,
      abi: AbiMap['balancer.gaugeV5'],
      address: r.gaugeAddress,
      functionName: 'claimable_reward',
      args: [userAddress, r.tokenAddress],
    }
  })

  const {
    results: poolsRewardTokensQuery,
    refetchAll,
    isLoading,
  } = useMulticall(poolsRewardTokensRequests)

  // Format claimable rewards data
  const poolRewardTokensData = Object.values(poolsRewardTokensQuery).reduce(
    (acc: ClaimableReward[], chain) => {
      if (!chain.data) return acc
      const chainData = chain.data
      const chainDataArr = Object.values(chainData) as Record<string, ClaimableBalanceResult>[]
      const gaugeAddresses = Object.keys(chainData)

      chainDataArr.forEach((claimableRewardRecord, idx) => {
        const gaugeAddress = gaugeAddresses[idx]
        const tokenAddresses = Object.keys(claimableRewardRecord)
        const results = Object.values(claimableRewardRecord)

        results.forEach((result, idx) => {
          if (result.status === 'success') {
            const balance = result.result
            if (!balance) return

            const gaugeData = rewardTokensList.find(r => r.gaugeAddress === gaugeAddress)
            if (!gaugeData) return

            const tokenPrice = priceFor(tokenAddresses[idx], gaugeData.pool.chain)

            const fiatBalance = tokenPrice
              ? bn(formatUnits(balance, 18)).multipliedBy(tokenPrice)
              : bn(0)

            acc.push({
              pool: gaugeData?.pool,
              tokenAddress: tokenAddresses[idx] as Address,
              gaugeAddress,
              balance,
              fiatBalance,
              formattedBalance: fNum('token', formatUnits(balance, 18)),
              decimals: 18,
            })
          }
        })
      })
      return acc
    },
    []
  )

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
    refetchClaimableRewards: refetchAll,
    isLoadingClaimableRewards: isLoading,
  }
}
