import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { Address } from 'wagmi'

export function isNativeToken(token: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain)
  return isSameAddress(token, networkConfig.tokens.nativeAsset.address)
}

export function isWrappedNativeToken(token: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain)
  return isSameAddress(token, networkConfig.tokens.addresses.wNativeAsset)
}
