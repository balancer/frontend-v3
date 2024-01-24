import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { balancerV2VaultABI } from '@/lib/modules/web3/contracts/abi/generated'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
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
    args: [userAddress, relayerAddress || emptyAddress], //TODO: remove emptyAddress once we define relayerAddress for all networks
    enabled: isConnected,
  })
  return {
    ...query,
    hasApprovedRelayer: query.data,
  }
}
