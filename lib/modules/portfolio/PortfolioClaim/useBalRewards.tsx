import { useMemo } from 'react'
import { PoolListItem } from '../../pool/pool.types'
import { AbiMap } from '../../web3/contracts/AbiMap'
import { Address } from 'viem'
import { useUserAccount } from '../../web3/useUserAccount'
import { formatUnits } from 'viem'
import { useMulticall } from '../../web3/contracts/useMulticall'
import { getPoolsByGaugesMap } from '../../pool/pool.utils'
import { ClaimableBalanceResult } from '../usePortfolio'
import { bn, fNum } from '@/lib/shared/utils/numbers'
import networkConfigs from '@/lib/config/networks'
import { useTokens } from '../../tokens/useTokens'
import BigNumber from 'bignumber.js'
import { getChainId } from '@/lib/config/app.config'

export interface BalTokenReward {
  balance: bigint
  decimals: number
  formattedBalance: string
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
        id: `${pool.address}.${gaugeAddress}`,
      }
    }) || []

  const {
    results: balTokensQuery,
    refetchAll,
    isLoading,
  } = useMulticall(balIncentivesRequests, {
    enabled: isConnected,
  })

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

        if (!balance) return
        const balTokenAddress = networkConfigs[pool.chain].tokens.addresses.bal
        const tokenPrice = balTokenAddress ? priceFor(balTokenAddress, pool.chain) : 0
        const fiatBalance = tokenPrice
          ? bn(formatUnits(balance, 18)).multipliedBy(tokenPrice)
          : bn(0)

        acc.push({
          gaugeAddress,
          pool,
          balance,
          formattedBalance: fNum('token', formatUnits(balance, 18)) || '0',
          fiatBalance,
          decimals: 18,
          tokenAddress: networkConfigs[pool.chain].tokens.addresses.bal,
        })
      })
    })
    return acc
  }, [])

  return {
    balRewardsData,
    refetchBalRewards: refetchAll,
    isLoadingBalRewards: isLoading,
  }
}
