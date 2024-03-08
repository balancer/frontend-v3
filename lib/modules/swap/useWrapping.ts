import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'wagmi'
import { isNativeToken, isWrappedNativeToken } from '../tokens/token.helpers'

export enum WrapType {
  WRAP = 'wrap',
  UNWRAP = 'unwrap',
}

export function isNativeWrapUnwrap(tokenIn: Address, tokenOut: Address, chain: GqlChain) {
  const tokenInIsNative = isNativeToken(tokenIn, chain) || isWrappedNativeToken(tokenIn, chain)
  const tokenOutIsNative = isNativeToken(tokenOut, chain) || isWrappedNativeToken(tokenOut, chain)

  return tokenInIsNative && tokenOutIsNative
}

export function getWrapType(tokenIn: Address, tokenOut: Address, chain: GqlChain): WrapType | null {
  if (isNativeToken(tokenIn, chain) && isWrappedNativeToken(tokenOut, chain)) {
    return WrapType.WRAP
  } else if (isWrappedNativeToken(tokenIn, chain) && isNativeToken(tokenOut, chain)) {
    return WrapType.UNWRAP
  }

  return null
}
