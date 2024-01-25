import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { balancerV2VaultABI } from '@/lib/modules/web3/contracts/abi/generated'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useContractRead } from 'wagmi'

export function useHasApprovedRelayer() {
  const { isConnected, userAddress } = useUserAccount()

  const { chainId, relayerAddress, vaultV2Address } = useNetworkConfig()

  const query = useContractRead({
    chainId,
    abi: balancerV2VaultABI,
    address: vaultV2Address,
    account: userAddress,
    functionName: 'hasApprovedRelayer',
    args: [userAddress, relayerAddress],
    enabled: isConnected,
  })
  return {
    ...query,
    hasApprovedRelayer: query.data,
  }
}
