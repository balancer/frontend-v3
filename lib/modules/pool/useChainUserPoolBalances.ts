import { Address, useContractRead } from 'wagmi'
import { usePool } from './usePool'
import { balancerV2GaugeV5ABI, balancerV2WeightedPoolV4ABI } from '../web3/contracts/abi/generated'
import { useUserAccount } from '../web3/useUserAccount'
import { formatUnits, zeroAddress } from 'viem'
import { useTokens } from '../tokens/useTokens'
import { sumBy } from 'lodash'
import { calcBptPriceRaw } from './pool.helpers'

export function useChainUserPoolBalances() {
  const { pool, chainId, chain } = usePool()
  const { userAddress, isConnected } = useUserAccount()
  const { priceFor } = useTokens()

  const { data: unstakedPoolBalance, isLoading: isLoadingUnstakedPoolBalance } = useContractRead({
    abi: balancerV2WeightedPoolV4ABI,
    address: pool.address as Address,
    functionName: 'balanceOf',
    args: [userAddress],
    enabled: isConnected,
    chainId,
  })

  const { data: stakedPoolBalance, isLoading: isLoadingStakedPoolBalance } = useContractRead({
    abi: balancerV2GaugeV5ABI,
    address: (pool.staking?.gauge?.gaugeAddress as Address) || zeroAddress,
    functionName: 'balanceOf',
    args: [userAddress],
    enabled: isConnected && pool.staking?.gauge?.gaugeAddress !== undefined,
    chainId,
  })

  const totalLiquidity = sumBy(pool.tokens, token => {
    return priceFor(token.address, chain) * parseFloat(token.balance)
  })

  const onChainBptPrice = calcBptPriceRaw(totalLiquidity.toString(), pool.dynamicData.totalShares)

  const isLoadingChainBalances = isLoadingUnstakedPoolBalance || isLoadingStakedPoolBalance
  const totalBalance = formatUnits((stakedPoolBalance || 0n) + (unstakedPoolBalance || 0n), 18)
  const stakedBalanceUsd =
    parseFloat(onChainBptPrice) * parseFloat(formatUnits(stakedPoolBalance || 0n, 18))

  const userBalance = {
    ...(pool.userBalance || {}),
    stakedBalance: stakedPoolBalance
      ? formatUnits(stakedPoolBalance || 0n, 18)
      : pool.userBalance?.stakedBalance,
    unstakedPoolBalance,
    totalBalance:
      stakedBalanceUsd && unstakedPoolBalance ? totalBalance : pool.userBalance?.totalBalance,
    stakedBalanceUsd: stakedBalanceUsd ? stakedBalanceUsd : pool.userBalance?.stakedBalanceUsd,
  }

  return {
    userBalance,
    isLoadingChainBalances,
  }
}
