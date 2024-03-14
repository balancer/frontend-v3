/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
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
import { bn, Numberish } from '@/lib/shared/utils/numbers'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { Dictionary, zipObject } from 'lodash'
import { createContext, PropsWithChildren, useCallback } from 'react'
import { Address } from 'wagmi'
import { TokenBase } from './token.types'
import { minsToMs } from '@/lib/shared/hooks/useTime'
import { useSkipInitialQuery } from '@/lib/shared/hooks/useSkipInitialQuery'

export type UseTokensResult = ReturnType<typeof _useTokens>
export const TokensContext = createContext<UseTokensResult | null>(null)

export function _useTokens(
  initTokenData: GetTokensQuery,
  initTokenPricesData: GetTokenPricesQuery,
  variables: GetTokensQueryVariables
) {
  const networkConfig = useNetworkConfig()
  const skipQuery = useSkipInitialQuery(variables)

  // skip initial fetch on mount so that initialData is used
  const { data: tokensData } = useQuery(GetTokensDocument, {
    variables,
    skip: skipQuery,
  })
  const { data: tokenPricesData } = useQuery(GetTokenPricesDocument, {
    variables,
    initialFetchPolicy: 'cache-only',
    nextFetchPolicy: 'cache-first',
    pollInterval: minsToMs(3),
  })

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

  /*
    It can return undefined when the token address belongs to a pool token (not included in the provided tokens)
    // TODO: should we avoid calling getToken with pool tokens?
   */
  function getToken(address: string, chain: GqlChain | number): GqlToken | undefined {
    const chainKey = typeof chain === 'number' ? 'chainId' : 'chain'
    return tokens.find(token => isSameAddress(token.address, address) && token[chainKey] === chain)
  }

  const getTokensByChain = useCallback(
    (chain: number | GqlChain): GqlToken[] => {
      const chainKey = typeof chain === 'number' ? 'chainId' : 'chain'
      return tokens.filter(token => token[chainKey] === chain)
    },
    [tokens]
  )

  function getTokensByTokenAddress(
    tokenAddresses: Address[],
    chain: GqlChain
  ): Dictionary<GqlToken> {
    return zipObject(
      tokenAddresses,
      tokenAddresses.map(t => getToken(t, chain) as GqlToken)
    )
  }

  function priceForToken(token: GqlToken): number {
    const price = prices.find(
      price => isSameAddress(price.address, token.address) && price.chain === token.chain
    )
    if (!price) return 0

    return price.price
  }

  const usdValueForToken = useCallback(
    (token: GqlToken | undefined, amount: Numberish) => {
      if (!token) return '0'
      if (amount === '') return '0'
      return bn(amount).times(priceForToken(token)).toFixed(2)
    },
    [JSON.stringify(prices)]
  )

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
    []
  )

  return {
    tokens,
    prices,
    getToken,
    priceFor,
    priceForToken,
    getTokensByChain,
    getTokensByTokenAddress,
    exclNativeAssetFilter,
    nativeAssetFilter,
    usdValueForToken,
    getPoolTokenWeightByBalance,
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
  const tokens = _useTokens(tokensData, tokenPricesData, variables)

  return <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>
}

export const useTokens = (): UseTokensResult => useMandatoryContext(TokensContext, 'Tokens')
