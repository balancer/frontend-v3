import { getChainId } from '@/lib/config/app.config'
import {
  GqlPoolStakingType,
  GqlUserStakedBalance,
} from '@/lib/shared/services/api/generated/graphql'
import { bn } from '@/lib/shared/utils/numbers'
import { groupBy } from 'lodash'
import { Address, formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { balancerV2GaugeV5Abi, auraBaseRewardPool4626Abi } from '../../web3/contracts/abi/generated'
import { Pool } from '../PoolProvider'
import { BPT_DECIMALS } from '../pool.constants'
import { calcBptPrice } from '../pool.helpers'

export type StakedBalancesByPoolId = ReturnType<
  typeof useUserStakedBalance
>['stakedBalancesByPoolId']

export function useUserStakedBalance(pools: Pool[] = []) {
  const { userAddress, isConnected } = useUserAccount()
  const poolByStaking = createPoolByStakingRecord(pools)
  const contracts = poolContracts(poolByStaking, userAddress)

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

  // for each pool replicate APIs GqlPoolUserBalance.stakedBalances api's type
  const stakedBalances = stakedPoolBalances.map((rawBalance, index) => {
    const stakingAddress = contracts[index].address
    const pool = poolByStaking[stakingAddress]
    const bptPrice = calcBptPrice(pool.dynamicData.totalLiquidity, pool.dynamicData.totalShares)
    const humanStakedBalance = formatUnits(rawBalance || 0n, BPT_DECIMALS)

    const stakingType =
      stakingAddress === pool.staking?.aura?.auraPoolAddress
        ? GqlPoolStakingType.Aura
        : GqlPoolStakingType.Gauge

    const stakedBalance: GqlUserStakedBalance = {
      __typename: 'GqlUserStakedBalance',
      stakingId: stakingAddress,
      balance: humanStakedBalance,
      balanceUsd: bn(humanStakedBalance).times(bptPrice).toNumber(),
      stakingType,
    }
    return {
      poolId: pool.id,
      ...stakedBalance,
    }
  })

  const stakedBalancesByPoolId = groupBy(stakedBalances, 'poolId')

  // return empty results for pools without gauges
  pools.forEach(pool => {
    if (!stakedBalancesByPoolId[pool.id]) {
      stakedBalancesByPoolId[pool.id] = []
    }
  })

  return {
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
function poolContracts(poolByStaking: Record<Address, Pool>, userAddress: Address) {
  const gaugeAddresses = Object.keys(poolByStaking) as Address[]
  return gaugeAddresses.map(
    gaugeAddress =>
      ({
        abi: poolByStaking[gaugeAddress].staking?.aura
          ? auraBaseRewardPool4626Abi
          : balancerV2GaugeV5Abi,
        address: gaugeAddress,
        functionName: 'balanceOf',
        args: [userAddress],
        chainId: getChainId(poolByStaking[gaugeAddress].chain),
      } as const)
  )
}

function createPoolByStakingRecord(pools: Pool[]): Record<Address, Pool> {
  return pools.reduce((acc, pool) => {
    const gaugeAddresses = getStakingAddresses(pool)
    gaugeAddresses.forEach(gaugeAddress => {
      acc[gaugeAddress] = pool
    })
    return acc
  }, {} as Record<Address, Pool>)
}

function getStakingAddresses(pool: Pool): Address[] {
  const preferentialGaugeAddress = pool.staking?.gauge?.gaugeAddress as Address
  const auraPoolAddress = pool.staking?.aura?.auraPoolAddress as Address
  const nonPreferentialGaugeAddresses =
    pool.staking?.gauge?.otherGauges?.map(otherGauge => otherGauge.gaugeAddress as Address) || []
  const gaugeAddresses = [
    auraPoolAddress,
    preferentialGaugeAddress,
    ...nonPreferentialGaugeAddresses,
  ].filter(Boolean)
  return gaugeAddresses
}
