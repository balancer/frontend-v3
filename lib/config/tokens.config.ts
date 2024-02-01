import { Address } from 'viem'
import { includesAddress } from '../shared/utils/addresses'
import { getNetworkConfig } from './app.config'
import { SupportedChainId } from './config.types'
import { GqlChain } from '../shared/services/api/generated/graphql'

export function getNativeAssetAddress(chainId: SupportedChainId) {
  return getNetworkConfig(chainId).tokens.nativeAsset.address
}

export function requiresDoubleApproval(
  chainId: GqlChain | SupportedChainId,
  tokenAddress: Address
) {
  return includesAddress(
    getNetworkConfig(chainId).tokens.doubleApprovalRequired || [],
    tokenAddress
  )
}
