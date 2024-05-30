import { getChainId } from '@/lib/config/app.config'
import { bn, isZero, safeSum } from '@/lib/shared/utils/numbers'
import { HumanAmount } from '@balancer/sdk'
import { groupBy, mapValues } from 'lodash'
import { Address, formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { balancerV2GaugeV5Abi } from '../../web3/contracts/abi/generated'
import { Pool } from '../PoolProvider'
import { BPT_DECIMALS } from '../pool.constants'
import { calcBptPrice } from '../pool.helpers'

export type StakedBalancesByPoolId = ReturnType<
  typeof useUserStakedBalance
>['stakedBalancesByPoolId']

export function useUserStakedBalance(pools: Pool[] = []) {
  const { userAddress, isConnected } = useUserAccount()
  const poolByGauge = createPoolByGaugeRecord(pools)
  const contracts = poolContracts(poolByGauge, userAddress)

  const {
    data: stakedPoolBalances = [],
    isLoading,
    refetch,
    error,
  } = useReadContracts({
    query: { enabled: isConnected },
    allowFailure: false,
    contracts,
  })

  // for each pool get the staked balance by gauge address
  const stakedBalancesByGauge = stakedPoolBalances.map((rawBalance, index) => {
    const gaugeAddress = contracts[index].address
    const pool = poolByGauge[contracts[index].address]
    const bptPrice = calcBptPrice(pool.dynamicData.totalLiquidity, pool.dynamicData.totalShares)
    const humanStakedBalance = formatUnits(rawBalance || 0n, BPT_DECIMALS)
    return {
      poolId: pool.id,
      gaugeAddress,
      isPreferential: gaugeAddress === pool.staking?.gauge?.gaugeAddress,
      rawStakedBalance: rawBalance,
      stakedBalance: humanStakedBalance,
      stakedBalanceUsd: bn(humanStakedBalance).times(bptPrice),
    }
  })

  // group staked balances and calculate totals by poolId
  const stakedBalancesByPoolId = mapValues(groupBy(stakedBalancesByGauge, 'poolId'), balances => {
    // Staked balance in preferential gauge
    const preferentialBalance = balances.find(balance => balance.isPreferential)
    const rawStakedBalance = preferentialBalance?.rawStakedBalance || 0n
    const stakedBalance = formatUnits(rawStakedBalance || 0n, BPT_DECIMALS) as HumanAmount
    const stakedBalanceUsd = preferentialBalance?.stakedBalanceUsd || '0'

    // Staked balance in non-preferential gauges
    const nonPreferentialBalances = balances.filter(balance => !balance.isPreferential)
    const nonPreferentialRawStakedBalance = BigInt(
      safeSum(nonPreferentialBalances.map(balance => balance.rawStakedBalance))
    )
    const nonPreferentialStakedBalance = formatUnits(
      nonPreferentialRawStakedBalance || 0n,
      BPT_DECIMALS
    ) as HumanAmount
    const nonPreferentialStakedBalanceUsd = safeSum(
      balances.filter(balance => !balance.isPreferential).map(balance => balance.stakedBalanceUsd)
    )

    return {
      // Includes gauges with 0 balance
      allStakedBalances: balances,
      // Only gauges with positive balance
      positiveStakedBalances: balances.filter(balance => !isZero(balance.stakedBalance)),
      stakedBalance,
      stakedBalanceUsd,
      rawStakedBalance,
      nonPreferentialStakedBalance,
      nonPreferentialStakedBalanceUsd,
      nonPreferentialRawStakedBalance,
    }
  })

  // return empty results for pools without gauges
  pools.forEach(pool => {
    if (!stakedBalancesByPoolId[pool.id]) {
      stakedBalancesByPoolId[pool.id] = {
        allStakedBalances: [],
        positiveStakedBalances: [],
        stakedBalance: '0',
        stakedBalanceUsd: '0',
        rawStakedBalance: BigInt(0),
        nonPreferentialStakedBalance: '0',
        nonPreferentialStakedBalanceUsd: '0',
        nonPreferentialRawStakedBalance: 0n,
      }
    }
  })

  return {
    stakedBalances: stakedBalancesByGauge,
    stakedBalancesByPoolId,
    isLoading,
    refetch,
    error,
  }
}

/*
  Builds the contracts array for the useReadContracts hook.
  One contract call for each gaugeAddress in a pool.
*/
function poolContracts(poolByGauge: Record<Address, Pool>, userAddress: Address) {
  const gaugeAddresses = Object.keys(poolByGauge) as Address[]
  return gaugeAddresses.map(
    gaugeAddress =>
      ({
        abi: balancerV2GaugeV5Abi,
        address: gaugeAddress,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: getChainId(poolByGauge[gaugeAddress].chain),
      } as const)
  )
}

function createPoolByGaugeRecord(pools: Pool[]): Record<Address, Pool> {
  return pools.reduce((acc, pool) => {
    const gaugeAddresses = getGaugeAddresses(pool)
    gaugeAddresses.forEach(gaugeAddress => {
      acc[gaugeAddress] = pool
    })
    return acc
  }, {} as Record<Address, Pool>)
}

function getGaugeAddresses(pool: Pool): Address[] {
  const preferentialGaugeAddress = pool.staking?.gauge?.gaugeAddress as Address
  const nonPreferentialGaugeAddresses =
    pool.staking?.gauge?.otherGauges?.map(otherGauge => otherGauge.gaugeAddress as Address) || []
  const gaugeAddresses = [preferentialGaugeAddress, ...nonPreferentialGaugeAddresses].filter(
    Boolean
  )
  return gaugeAddresses
}
