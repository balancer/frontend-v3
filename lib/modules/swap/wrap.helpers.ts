import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'wagmi'
import { isNativeToken, isWrappedNativeToken } from '../tokens/token.helpers'
import { getNetworkConfig } from '@/lib/config/app.config'
import { isSameAddress, sameAddresses } from '@/lib/shared/utils/addresses'
import { LidoWrapHandler } from './handlers/LidoWrap.handler'
import { SwapHandler } from './handlers/Swap.handler'
import { SupportedWrapHandler, WrapType } from './swap.types'

export function isNativeWrap(tokenIn: Address, tokenOut: Address, chain: GqlChain) {
  const tokenInIsNative = isNativeToken(tokenIn, chain) || isWrappedNativeToken(tokenIn, chain)
  const tokenOutIsNative = isNativeToken(tokenOut, chain) || isWrappedNativeToken(tokenOut, chain)

  return tokenInIsNative && tokenOutIsNative
}

export function isSupportedWrap(tokenIn: Address, tokenOut: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain)
  const supportedWrappers = networkConfig.tokens.supportedWrappers || []
  return supportedWrappers.some(wrapper =>
    sameAddresses([wrapper.baseToken, wrapper.wrappedToken], [tokenIn, tokenOut])
  )
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

export function getWrapHandlerClass(
  tokenIn: Address,
  tokenOut: Address,
  chain: GqlChain
): new () => SwapHandler {
  const wrapper = getWrapConfig(tokenIn, tokenOut, chain)

  switch (wrapper.swapHandler) {
    case SupportedWrapHandler.LIDO:
      return LidoWrapHandler
    default:
      throw new Error('Unsupported wrap handler')
  }
}

export function getWrapType(tokenIn: Address, tokenOut: Address, chain: GqlChain): WrapType | null {
  if (isNativeToken(tokenIn, chain) && isWrappedNativeToken(tokenOut, chain)) {
    return WrapType.WRAP
  } else if (isWrappedNativeToken(tokenIn, chain) && isNativeToken(tokenOut, chain)) {
    return WrapType.UNWRAP
  } else if (isSupportedWrap(tokenIn, tokenOut, chain)) {
    const wrapper = getWrapConfig(tokenIn, tokenOut, chain)
    return isSameAddress(wrapper.baseToken, tokenIn) ? WrapType.WRAP : WrapType.UNWRAP
  }

  return null
}

export function getWrapperForBaseToken(baseToken: Address, chain: GqlChain) {
  const networkConfig = getNetworkConfig(chain)
  const supportedWrappers = networkConfig.tokens.supportedWrappers || []
  return supportedWrappers.find(wrapper => isSameAddress(wrapper.baseToken, baseToken))
}
