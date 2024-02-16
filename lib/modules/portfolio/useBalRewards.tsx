import { useMemo } from 'react'
import { PoolListItem } from '../pool/pool.types'
import { AbiMap } from '../web3/contracts/AbiMap'
import { Address } from 'viem'
import { useUserAccount } from '../web3/useUserAccount'
import { formatUnits } from 'viem'
import { useMulticall } from '../web3/contracts/useMulticall'
import { getPoolsByGaugesMap } from '../pool/pool.utils'
import { ClaimableBalanceResult } from './usePortfolio'
import { fNum } from '@/lib/shared/utils/numbers'

export interface BalTokenReward {
  balance: bigint
  decimals: number
  formattedBalance: string
  gaugeAddress: string
  pool: PoolListItem
}

export function useBalTokenRewards(pools: PoolListItem[]) {
  const { userAddress } = useUserAccount()

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
        chain: pool.chain,
        id: `${pool.address}.${gaugeAddress}`,
      }
    }) || []

  const balTokensQuery = useMulticall(balIncentivesRequests)

  // Bal incentives
  const balRewardsData = Object.values(balTokensQuery).reduce((acc: BalTokenReward[], chain) => {
    if (!chain.data) return acc

    const chainDataArr = Object.values(chain.data) as Record<Address, ClaimableBalanceResult>[]
    chainDataArr.forEach(claimableBalance => {
      const gaugesAddresses = Object.keys(claimableBalance) as Address[]

      gaugesAddresses.forEach(gaugeAddress => {
        const gaugeData = claimableBalance[gaugeAddress]
        const pool = poolByGaugeMap[gaugeAddress]
        let balance = BigInt(0)
        if (gaugeData.status === 'success') {
          balance = gaugeData.result
        }
        acc.push({
          gaugeAddress,
          pool,
          balance: gaugeData.result,
          formattedBalance: fNum('token', formatUnits(balance, 18)),
          decimals: 18,
        })
      })
    })
    return acc
  }, [])

  return {
    balRewardsData,
  }
}
