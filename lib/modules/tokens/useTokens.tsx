'use client'

import {
  GetTokenPricesDocument,
  GetTokenPricesQuery,
  GetTokensDocument,
  GetTokensQuery,
  GetTokensQueryVariables,
  GqlChain,
  GqlPoolToken,
  GqlToken,
} from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { createContext, PropsWithChildren, useCallback } from 'react'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { TokenBase } from './token.types'
import { Numberish, bn } from '@/lib/shared/hooks/useNumbers'

export type UseTokensResult = ReturnType<typeof _useTokens>
export const TokensContext = createContext<UseTokensResult | null>(null)

export function _useTokens(
  initTokenData: GetTokensQuery,
  initTokenPricesData: GetTokenPricesQuery,
  variables: GetTokensQueryVariables
) {
  const networkConfig = useNetworkConfig()

  const { data: tokensData } = useQuery(GetTokensDocument, { variables })
  const { data: tokenPricesData } = useQuery(GetTokenPricesDocument)

  const tokens = tokensData?.tokens || initTokenData.tokens
  const prices = tokenPricesData?.tokenPrices || initTokenPricesData.tokenPrices

  const nativeAssetFilter = (token: TokenBase | string) => {
    if (typeof token === 'string') {
      return isSameAddress(token, networkConfig.tokens.nativeAsset.address)
    }
    return isSameAddress(token.address, networkConfig.tokens.nativeAsset.address)
  }

  const exclNativeAssetFilter = (token: TokenBase | string) => {
    if (typeof token === 'string') {
      return !isSameAddress(token, networkConfig.tokens.nativeAsset.address)
    }
    return !isSameAddress(token.address, networkConfig.tokens.nativeAsset.address)
  }

  function getToken(address: string, chain: GqlChain | number): GqlToken | undefined {
    const chainKey = typeof chain === 'number' ? 'chainId' : 'chain'
    return tokens.find(token => isSameAddress(token.address, address) && token[chainKey] === chain)
  }

  function getTokensByChain(chain: number | GqlChain): GqlToken[] {
    const key = typeof chain === 'number' ? 'chainId' : 'chain'
    return tokens.filter(token => token[key] === chain)
  }

  function priceForToken(token: GqlToken): number {
    const price = prices.find(
      price => isSameAddress(price.address, token.address) && price.chain === token.chain
    )
    if (!price) return 0

    return price.price
  }

  function usdValueForToken(token: GqlToken, amount: Numberish): string {
    return bn(amount).times(priceForToken(token)).toFixed(2)
  }

  function priceFor(address: string, chain: GqlChain): number {
    const token = getToken(address, chain)
    if (!token) return 0

    return priceForToken(token)
  }

  const getPoolTokenWeightByBalance = useCallback(
    (poolTotalLiquidity: string, token: GqlPoolToken, chain: GqlChain) => {
      return (
        (priceFor(token.address, chain) * parseFloat(token.balance)) /
        parseFloat(poolTotalLiquidity)
      )
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const calculateTokensValue = useCallback(
    (tokenAddress: string, tokenAmount: Numberish, chain: GqlChain) => {
      return priceFor(tokenAddress, chain) * parseFloat(tokenAmount as string)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return {
    tokens,
    prices,
    getToken,
    priceFor,
    priceForToken,
    getTokensByChain,
    exclNativeAssetFilter,
    nativeAssetFilter,
    usdValueForToken,
    getPoolTokenWeightByBalance,
    calculateTokensValue,
  }
}

export function TokensProvider({
  children,
  tokensData,
  tokenPricesData,
  variables,
}: PropsWithChildren & {
  tokensData: GetTokensQuery
  tokenPricesData: GetTokenPricesQuery
  variables: GetTokensQueryVariables
}) {
  useSeedApolloCache({
    query: GetTokensDocument,
    data: tokensData,
    variables,
  })
  useSeedApolloCache({
    query: GetTokenPricesDocument,
    data: tokenPricesData,
  })

  const tokens = _useTokens(tokensData, tokenPricesData, variables)

  return <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>
}

export const useTokens = (): UseTokensResult => useMandatoryContext(TokensContext, 'Tokens')
