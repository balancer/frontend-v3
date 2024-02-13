import { PoolListItem } from '../pool/pool.types'

import { Address } from 'wagmi'
import { useUserAccount } from '../web3/useUserAccount'
import { useMulticall } from '../web3/contracts/useMulticall'
import { AbiMap } from '../web3/contracts/AbiMap'
import { ClaimableBalanceResult } from './usePortfolio'
import { useMemo } from 'react'

interface ClaimableReward {
  balance: bigint
  decimals?: number
  formattedBalance: string
  gaugeAddress: string
  pool: PoolListItem
  tokenAddress: Address
}

export function useClaimableBalances(pools: PoolListItem[]) {
  const { userAddress } = useUserAccount()

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
      id: `${r.pool.address}.${r.gaugeAddress}`,
      abi: AbiMap['balancer.gaugeV5'],
      address: r.gaugeAddress,
      functionName: 'claimable_reward',
      args: [userAddress, r.tokenAddress],
    }
  })

  const poolsRewardTokensQuery = useMulticall(poolsRewardTokensRequests)

  // Format claimable rewards data
  const poolRewardTokensData = Object.values(poolsRewardTokensQuery).reduce(
    (acc: ClaimableReward[], chain) => {
      if (!chain.data) return acc
      const chainDataArr = Object.values(chain.data) as Record<string, ClaimableBalanceResult>[]

      chainDataArr.forEach(claimableReward => {
        const gaugesAddresses = Object.keys(claimableReward)

        gaugesAddresses.forEach(gaugeAddress => {
          const balance = claimableReward[gaugeAddress]

          if (balance.status === 'success') {
            const gaugeData = rewardTokensList.find(r => r.gaugeAddress === gaugeAddress)
            if (!gaugeData) return

            acc.push({
              pool: gaugeData?.pool,
              tokenAddress: gaugeData?.tokenAddress,
              gaugeAddress,
              balance: balance.result,
              formattedBalance: balance.result.toString(),
              decimals: 18,
            })
          }
        })
      })
      return acc
    },
    []
  )

  return {
    claimableRewards: poolRewardTokensData,
  }
}
