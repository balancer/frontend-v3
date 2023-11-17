'use client'

import {
  GetTokenPricesDocument,
  GetTokenPricesQuery,
  GetTokensDocument,
  GetTokensQuery,
  GetTokensQueryVariables,
  GqlChain,
  GqlToken,
} from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { createContext, PropsWithChildren } from 'react'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'

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

  // 'new Set' for temp removal of duplicates, should be fixed in API
  const tokens = [...new Set(tokensData?.tokens || initTokenData.tokens)]
  const prices = tokenPricesData?.tokenPrices || initTokenPricesData.tokenPrices

  const nativeAssetFilter = (token: GqlToken | string) => {
    if (typeof token === 'string') {
      return isSameAddress(token, networkConfig.tokens.nativeAsset.address)
    }
    return isSameAddress(token.address, networkConfig.tokens.nativeAsset.address)
  }

  const exclNativeAssetFilter = (token: GqlToken | string) => {
    if (typeof token === 'string') {
      return !isSameAddress(token, networkConfig.tokens.nativeAsset.address)
    }
    return !isSameAddress(token.address, networkConfig.tokens.nativeAsset.address)
  }

  function getToken(address: string, chain: GqlChain): GqlToken | undefined {
    return tokens.find(token => isSameAddress(token.address, address) && token.chain === chain)
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

  function priceFor(address: string, chain: GqlChain): number {
    const token = getToken(address, chain)
    if (!token) return 0

    return priceForToken(token)
  }

  return {
    tokens,
    prices,
    getToken,
    priceFor,
    priceForToken,
    getTokensByChain,
    exclNativeAssetFilter,
    nativeAssetFilter,
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
