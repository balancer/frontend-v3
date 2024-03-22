import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { balancerMinterABI } from '@/lib/modules/web3/contracts/abi/generated'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useContractRead } from 'wagmi'

export function useHasMinterApproval() {
  const { isConnected, userAddress } = useUserAccount()

  const networkConfig = useNetworkConfig()
  const { chainId, contracts } = networkConfig

  const query = useContractRead({
    chainId,
    abi: balancerMinterABI,
    address: contracts.balancer.minter,
    account: userAddress,
    functionName: 'getMinterApproval',
    args: [contracts.balancer.relayerV6, userAddress],
    enabled: isConnected,
  })
  return {
    ...query,
    hasMinterApproval: query.data ?? false,
  }
}
