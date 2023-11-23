import { Address } from 'viem'
import { includesAddress } from '../shared/utils/addresses'
import { getNetworkConfig } from './app.config'
import { SupportedChainId } from './config.types'

export function getNativeAssetAddress(chainId: SupportedChainId) {
  return getNetworkConfig(chainId).tokens.nativeAsset.address
}

export function requiresDoubleApproval(chainId: SupportedChainId, tokenAddress: Address) {
  return includesAddress(
    getNetworkConfig(chainId).tokens.doubleApprovalRequired || [],
    tokenAddress
  )
}
