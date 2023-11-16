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

export type UseTokensResult = ReturnType<typeof _useTokens>
export const TokensContext = createContext<UseTokensResult | null>(null)

export function _useTokens(
  initTokenData: GetTokensQuery,
  initTokenPricesData: GetTokenPricesQuery,
  variables: GetTokensQueryVariables
) {
  const { data: tokensData } = useQuery(GetTokensDocument, { variables })
  const { data: tokenPricesData } = useQuery(GetTokenPricesDocument)

  const tokens = tokensData?.tokens || initTokenData.tokens
  const prices = tokenPricesData?.tokenPrices || initTokenPricesData.tokenPrices

  function getToken(address: string, chain: GqlChain): GqlToken | undefined {
    return tokens.find(token => isSameAddress(token.address, address) && token.chain === chain)
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

  return { tokens, prices, getToken, priceFor, priceForToken }
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
