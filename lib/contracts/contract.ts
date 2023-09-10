import { WalletClient, usePublicClient } from 'wagmi'
import { useNetworkConfig } from '../config/useNetworkConfig'
import { get } from 'lodash'

export function getContractConfig(contractPath: string, walletClient?: WalletClient) {
  const networkConfig = useNetworkConfig()
  const publicClient = usePublicClient()
  const address = get(networkConfig.contracts, contractPath)
  if (walletClient) {
    return {
      address,
      publicClient,
      walletClient,
    }
  }

  return {
    address,
    publicClient,
  }
}

