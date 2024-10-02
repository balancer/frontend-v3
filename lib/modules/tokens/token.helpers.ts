import {
  getNativeAssetAddress,
  getNetworkConfig,
  getWrappedNativeAssetAddress,
} from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { includesAddress, isSameAddress } from '@/lib/shared/utils/addresses'
import { Address, formatUnits } from 'viem'
import { HumanTokenAmountWithAddress, TokenBase, TokenAmount } from './token.types'
import { HumanAmount, InputAmount, Slippage } from '@balancer/sdk'
import { Pool } from '../pool/PoolProvider'
import { getVaultConfig, isCowAmmPool, isV3Pool } from '../pool/pool.helpers'

export function isNativeAsset(token: TokenBase | string, chain: GqlChain | SupportedChainId) {
  return nativeAssetFilter(chain)(token)
}

export function isWrappedNativeAsset(
  token: TokenBase | string,
  chain: GqlChain | SupportedChainId
) {
  return wrappedNativeAssetFilter(chain)(token)
}

export function isNativeOrWrappedNative(
  token: TokenBase | string,
  chain: GqlChain | SupportedChainId
) {
  return isWrappedNativeAsset(token, chain) || isNativeAsset(token, chain)
}

export function nativeAssetFilter(chain: GqlChain | SupportedChainId) {
  return (token: TokenBase | string) => {
    const nativeAssetAddress = getNativeAssetAddress(chain)
    if (typeof token === 'string') {
      return isSameAddress(token, nativeAssetAddress)
    }
    return isSameAddress(token.address, nativeAssetAddress)
  }
}

export function wrappedNativeAssetFilter(chain: GqlChain | SupportedChainId) {
  return (token: TokenBase | string) => {
    const wNativeAssetAddress = getWrappedNativeAssetAddress(chain)
    if (typeof token === 'string') {
      return isSameAddress(token, wNativeAssetAddress)
    }
    return isSameAddress(token.address, wNativeAssetAddress)
  }
}

export function exclNativeAssetFilter(chain: GqlChain | SupportedChainId) {
  return (token: TokenBase | string) => {
    const nativeAssetAddress = getNativeAssetAddress(chain)
    if (typeof token === 'string') {
      return !isSameAddress(token, nativeAssetAddress)
    }
    return !isSameAddress(token.address, nativeAssetAddress)
  }
}

export function exclWrappedNativeAssetFilter(chain: GqlChain | SupportedChainId) {
  return (token: TokenBase | string) => {
    const wNativeAssetAddress = getWrappedNativeAssetAddress(chain)
    if (typeof token === 'string') {
      return !isSameAddress(token, wNativeAssetAddress)
    }
    return !isSameAddress(token.address, wNativeAssetAddress)
  }
}

/*
  If the given array contains the native asset, it is replaced with the wrapped native asset
*/
export function swapNativeWithWrapped(inputAmounts: InputAmount[], chain: GqlChain) {
  return inputAmounts.map(inputAmount => {
    if (isNativeAsset(inputAmount.address, chain)) {
      return {
        ...inputAmount,
        address: getWrappedNativeAssetAddress(chain),
      }
    }
    return inputAmount
  })
}

/*
  If the given array contains the wrapped native asset, it is replaced with the native asset
*/
export function swapWrappedWithNative(
  inputAmounts: HumanTokenAmountWithAddress[],
  chain: GqlChain
) {
  return inputAmounts.map(inputAmount => {
    if (isWrappedNativeAsset(inputAmount.tokenAddress, chain)) {
      return {
        ...inputAmount,
        tokenAddress: getNativeAssetAddress(chain),
      } as HumanTokenAmountWithAddress
    }
    return inputAmount
  })
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

type PoolToken = Pool['poolTokens'][0]
export function getLeafTokens(poolTokens: PoolToken[]) {
  const leafTokens: PoolToken[] = []

  poolTokens.forEach(poolToken => {
    if (poolToken.nestedPool) {
      const nestedTokens = poolToken.nestedPool.tokens.filter(
        // Exclude the pool token itself
        t => !isSameAddress(t.address, poolToken.address)
      ) as PoolToken[]
      leafTokens.push(...nestedTokens)
    } else {
      leafTokens.push(poolToken)
    }
  })

  return leafTokens
}

export function getSpenderForAddLiquidity(pool: Pool): Address {
  if (isCowAmmPool(pool.type)) return pool.address as Address
  if (isV3Pool(pool)) {
    const permit2Address = getNetworkConfig(pool.chain).contracts.permit2
    if (!permit2Address) {
      throw new Error(`Permit2 feature is not yet available for this chain (${pool.chain}) `)
    }
    return permit2Address
  }
  const { vaultAddress } = getVaultConfig(pool)
  return vaultAddress
}

export function tokenAmountMinusSlippage(tokenAmount: TokenAmount, slippage: HumanAmount | string) {
  const _slippage = Slippage.fromPercentage(slippage as HumanAmount)
  const amount = _slippage.applyTo(tokenAmount.amount, -1)

  return {
    ...tokenAmount,
    amount,
    formatted: formatUnits(amount, tokenAmount.decimals),
  }
}
