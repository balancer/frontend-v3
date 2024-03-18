import { useContractRead } from 'wagmi'
import { useUserAccount } from '../../web3/useUserAccount'
import { FeeDistributorStaticABI } from '../../web3/contracts/abi/FeeDistributorStaticABI'
import networkConfigs from '@/lib/config/networks'
import { formatUnits } from 'viem'
import { useTokens } from '../../tokens/useTokens'
import { bn } from '@/lib/shared/utils/numbers'

export const claimableVeBalRewardsTokens: string[] = [
  '0x7B50775383d3D6f0215A8F290f2C9e2eEBBEceb2', // bb-a-USD v1
  '0xA13a9247ea42D743238089903570127DdA72fE44', // bb-a-USD v2
  '0xfeBb0bbf162E64fb9D0dfe186E517d84C395f016', // bb-a-USD v3
  '0xba100000625a3754423978a60c9317c58a424e3D', // BAL
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
]

export function useProtocolRewards() {
  const { userAddress, isConnected } = useUserAccount()
  const { priceFor } = useTokens()

  const {
    data: protocolRewardsData = [],
    isLoading: isLoadingProtocolRewards,
    error: protocolRewardsError,
  } = useContractRead({
    chainId: networkConfigs.MAINNET.chainId,
    enabled: isConnected,
    address: networkConfigs.MAINNET.contracts.feeDistributor,
    abi: FeeDistributorStaticABI,
    functionName: 'claimTokens',
    args: [userAddress, claimableVeBalRewardsTokens],
    select: data => {
      return (data as bigint[]).map((clBalance, index) => {
        const tokenAddress = claimableVeBalRewardsTokens[index]
        const tokenPrice = priceFor(tokenAddress, networkConfigs.MAINNET.chain)
        const formattedBalance = formatUnits(clBalance, 18)
        return {
          tokenAddress,
          balance: clBalance,
          formattedBalance,
          fiatBalance: bn(formattedBalance).multipliedBy(tokenPrice),
        }
      })
    },
  })

  return {
    protocolRewardsData,
    isLoadingProtocolRewards,
    protocolRewardsError,
  }
}
