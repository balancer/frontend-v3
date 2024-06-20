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
import { balancerV2GaugeV5Abi } from '../../web3/contracts/abi/generated'
import { Pool } from '../PoolProvider'
import { BPT_DECIMALS } from '../pool.constants'
import { calcBptPrice } from '../pool.helpers'

export type GaugeStakedBalancesByPoolId = ReturnType<
  typeof useUserStakedBalance
>['gaugeStakedBalancesByPoolId']

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

  // for each pool replicate APIs GqlPoolUserBalance.stakedBalances api's type
  const gaugeStakedBalances = stakedPoolBalances.map((rawBalance, index) => {
    const gaugeAddress = contracts[index].address
    const pool = poolByGauge[contracts[index].address]
    const bptPrice = calcBptPrice(pool.dynamicData.totalLiquidity, pool.dynamicData.totalShares)
    const humanStakedBalance = formatUnits(rawBalance || 0n, BPT_DECIMALS)

    const stakedBalance: GqlUserStakedBalance = {
      __typename: 'GqlUserStakedBalance',
      stakingId: gaugeAddress,
      balance: humanStakedBalance,
      balanceUsd: bn(humanStakedBalance).times(bptPrice).toNumber(),
      stakingType: GqlPoolStakingType.Gauge,
    }
    return {
      poolId: pool.id,
      ...stakedBalance,
    }
  })

  const gaugeStakedBalancesByPoolId = groupBy(gaugeStakedBalances, 'poolId')

  // return empty results for pools without gauges
  pools.forEach(pool => {
    if (!gaugeStakedBalancesByPoolId[pool.id]) {
      gaugeStakedBalancesByPoolId[pool.id] = []
    }
  })

  return {
    gaugeStakedBalancesByPoolId,
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
