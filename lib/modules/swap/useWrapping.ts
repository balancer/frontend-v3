import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'wagmi'
import { isNativeToken, isWrappedNativeToken } from '../tokens/token.helpers'
import { getNetworkConfig } from '@/lib/config/app.config'
import { sameAddresses } from '@/lib/shared/utils/addresses'

export enum WrapType {
  WRAP = 'wrap',
  UNWRAP = 'unwrap',
}

export function isNativeWrap(tokenIn: Address, tokenOut: Address, chain: GqlChain) {
  const tokenInIsNative = isNativeToken(tokenIn, chain) || isWrappedNativeToken(tokenIn, chain)
  const tokenOutIsNative = isNativeToken(tokenOut, chain) || isWrappedNativeToken(tokenOut, chain)

  return tokenInIsNative && tokenOutIsNative
}

export function isSupportedWrap(tokenIn: Address, tokenOut: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain)
  const supportedWrappers = networkConfig.tokens.supportedWrappers || []
  return supportedWrappers.some(wrapper => {
    console.log([wrapper.baseToken, wrapper.wrappedToken], [tokenIn, tokenOut])
    return sameAddresses([wrapper.baseToken, wrapper.wrappedToken], [tokenIn, tokenOut])
  })
}

export function getWrapConfig(tokenIn: Address, tokenOut: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain)
  const supportedWrappers = networkConfig.tokens.supportedWrappers || []
  if (!isSupportedWrap(tokenIn, tokenOut, chain)) throw new Error('Unsupported wrap')

  const wrapper = supportedWrappers.find(wrapper =>
    sameAddresses([wrapper.baseToken, wrapper.wrappedToken], [tokenIn, tokenOut])
  )

  if (!wrapper) throw new Error('Wrapper not found')

  return wrapper
}

export function getWrapHandler(tokenIn: Address, tokenOut: Address, chain: GqlChain) {
  const wrapper = getWrapConfig(tokenIn, tokenOut, chain)

  return wrapper?.swapHandlerClass
}

export function getWrapType(tokenIn: Address, tokenOut: Address, chain: GqlChain): WrapType | null {
  if (isNativeToken(tokenIn, chain) && isWrappedNativeToken(tokenOut, chain)) {
    return WrapType.WRAP
  } else if (isWrappedNativeToken(tokenIn, chain) && isNativeToken(tokenOut, chain)) {
    return WrapType.UNWRAP
  } else if (isSupportedWrap(tokenIn, tokenOut, chain)) {
    const wrapper = getWrapConfig(tokenIn, tokenOut, chain)
    return tokenIn === wrapper.baseToken ? WrapType.WRAP : WrapType.UNWRAP
  }

  return null
}
