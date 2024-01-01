import { Address, useContractRead } from 'wagmi'
import { usePool } from './usePool'
import { balancerV2GaugeV5ABI, balancerV2WeightedPoolV4ABI } from '../web3/contracts/abi/generated'
import { useUserAccount } from '../web3/useUserAccount'
import { formatUnits, zeroAddress } from 'viem'

export function useChainUserPoolBalances() {
  const { pool, chainId, bptPrice } = usePool()
  const { userAddress, isConnected } = useUserAccount()

  const { data: unstakedPoolBalance = 0n, isLoading: isLoadingUnstakedPoolBalance } =
    useContractRead({
      abi: balancerV2WeightedPoolV4ABI,
      address: pool.address as Address,
      functionName: 'balanceOf',
      args: [userAddress],
      enabled: isConnected,
      chainId,
    })

  const { data: stakedPoolBalance = 0n, isLoading: isLoadingStakedPoolBalance } = useContractRead({
    abi: balancerV2GaugeV5ABI,
    address: (pool.staking?.gauge?.gaugeAddress as Address) || zeroAddress,
    functionName: 'balanceOf',
    args: [userAddress],
    enabled: isConnected && pool.staking?.gauge?.gaugeAddress !== undefined,
    chainId,
  })

  const isLoadingChainBalances = isLoadingUnstakedPoolBalance || isLoadingStakedPoolBalance
  const totalBalance = formatUnits(stakedPoolBalance + unstakedPoolBalance, 18)
  const totalBalanceUsd = parseFloat(bptPrice) * parseFloat(totalBalance)
  const stakedBalanceUsd = parseFloat(bptPrice) * parseFloat(formatUnits(stakedPoolBalance, 18))

  const userBalance = {
    ...(pool.userBalance || {}),
    stakedBalance: formatUnits(stakedPoolBalance, 18),
    unstakedPoolBalance,
    totalBalance,
    totalBalanceUsd,
    stakedBalanceUsd,
  }

  return {
    userBalance,
    isLoadingChainBalances,
  }
}
