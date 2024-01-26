import { getNetworkConfig } from './app.config'
import { SupportedChainId } from './config.types'

export function getNativeAssetAddress(chainId: SupportedChainId) {
  return getNetworkConfig(chainId).tokens.nativeAsset.address
}
