import { getNetworkConfig } from '@/lib/config/app.config'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { GqlChain } from '../services/api/generated/graphql'

export function useBlockExplorer(chain?: GqlChain) {
  const { blockExplorerBaseUrl } = useNetworkConfig()

  const baseUrl = chain ? getNetworkConfig(chain).blockExplorerBaseUrl : blockExplorerBaseUrl

  function getBlockExplorerTxUrl(txHash: string) {
    return `${baseUrl}/tx/${txHash}`
  }

  function getBlockExplorerAddressUrl(address: string) {
    return `${baseUrl}/address/${address}`
  }

  function getBlockExplorerTokenUrl(address: string) {
    return `${baseUrl}/token/${address}`
  }

  function getBlockExplorerBlockUrl(block: number) {
    return `${baseUrl}/block/${block}`
  }

  return {
    getBlockExplorerTxUrl,
    getBlockExplorerAddressUrl,
    getBlockExplorerTokenUrl,
    getBlockExplorerBlockUrl,
  }
}
