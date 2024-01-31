import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { balancerV2VaultABI } from '@/lib/modules/web3/contracts/abi/generated'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useContractRead } from 'wagmi'

export function useHasApprovedRelayer() {
  const { isConnected, userAddress } = useUserAccount()

  const networkConfig = useNetworkConfig()
  const { chainId, contracts } = networkConfig

  const query = useContractRead({
    chainId: chainId,
    abi: balancerV2VaultABI,
    address: contracts.balancer.vaultV2,
    account: userAddress,
    functionName: 'hasApprovedRelayer',
    args: [userAddress, contracts.balancer.relayerV6],
    enabled: isConnected,
  })
  return {
    ...query,
    hasApprovedRelayer: query.data ?? false,
  }
}
