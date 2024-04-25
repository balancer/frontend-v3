import {
  getNativeAssetAddress,
  getNetworkConfig,
  getWrappedNativeAssetAddress,
} from '@/lib/config/app.config'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { Address } from 'wagmi'

export function isNativeAsset(token: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain)
  return isSameAddress(token, networkConfig.tokens.nativeAsset.address)
}

export function isWrappedNativeAsset(token: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain)
  return isSameAddress(token, networkConfig.tokens.addresses.wNativeAsset)
}

export function isNativeOrWrappedNative(token: Address, chain: GqlChain) {
  return isWrappedNativeAsset(token, chain) || isNativeAsset(token, chain)
}

/**
 * If the provided token is the native token,
 * returns the token with the wrapped native token based on the provided token and chain,
 * else returns the provided token
 *
 * @param {Address} token - The token address.
 * @param {GqlChain} chain - The chain type.
 * @return {Address} The swapped token address.
 */
export function swapNativeWithWrappedNative(token: Address, chain: GqlChain) {
  if (isNativeAsset(token, chain)) {
    return getWrappedNativeAssetAddress(chain).toLowerCase() as Address
  } else {
    return token
  }
}
