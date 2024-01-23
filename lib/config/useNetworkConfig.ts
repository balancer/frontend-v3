import { useNetwork } from 'wagmi'
import { getNetworkConfig, getRelayerAddress, getVaultAddress } from '@/lib/config/app.config'

export function useNetworkConfig() {
  const { chain } = useNetwork()

  const networkConfig = getNetworkConfig(chain?.id)

  return {
    ...networkConfig,
    vaultV2Address: getVaultAddress(networkConfig.chainId, 'v2'),
    // vaultV3Address: getVaultAddress(networkConfig.chainId, 'v3'),
    relayerAddress: getRelayerAddress(networkConfig.chainId),
  }
}
