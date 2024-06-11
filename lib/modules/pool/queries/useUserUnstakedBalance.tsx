import { getChainId } from '@/lib/config/app.config'
import { bn } from '@/lib/shared/utils/numbers'
import { keyBy } from 'lodash'
import { Address, formatUnits } from 'viem'
import { useReadContracts } from 'wagmi'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { balancerV2WeightedPoolV4Abi } from '../../web3/contracts/abi/generated'
import { Pool } from '../PoolProvider'
import { BPT_DECIMALS } from '../pool.constants'
import { calcBptPrice } from '../pool.helpers'

export type UnstakedBalanceByPoolId = ReturnType<
  typeof useUserUnstakedBalance
>['unstakedBalanceByPoolId']

export function useUserUnstakedBalance(pools: Pool[] = []) {
  const { userAddress, isConnected } = useUserAccount()

  const {
    data: unstakedPoolBalances = [],
    isLoading,
    refetch,
    error,
  } = useReadContracts({
    allowFailure: false,
    query: {
      enabled: isConnected,
    },
    contracts: pools.map(
      pool =>
        ({
          abi: balancerV2WeightedPoolV4Abi,
          address: pool.address as Address,
          functionName: 'balanceOf',
          args: [userAddress as Address],
          chainId: getChainId(pool.chain),
        } as const)
    ),
  })

  // for each pool get the unstaked balance
  const balances = unstakedPoolBalances.map((rawBalance, index) => {
    const pool = pools[index]
    const bptPrice = calcBptPrice(pool.dynamicData.totalLiquidity, pool.dynamicData.totalShares)
    const humanUnstakedBalance = formatUnits(rawBalance || 0n, BPT_DECIMALS)
    return {
      poolId: pool.id,
      rawUnstakedBalance: rawBalance,
      unstakedBalance: humanUnstakedBalance,
      unstakedBalanceUsd: bn(humanUnstakedBalance).times(bptPrice),
    }
  })

  const unstakedBalanceByPoolId = keyBy(balances, 'poolId')

  return {
    unstakedBalanceByPoolId,
    isLoading,
    refetch,
    error,
  }
}
