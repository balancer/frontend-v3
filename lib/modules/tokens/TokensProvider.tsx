/* eslint-disable react-hooks/exhaustive-deps */
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
import { bn, Numberish } from '@/lib/shared/utils/numbers'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { Dictionary, zipObject } from 'lodash'
import { createContext, PropsWithChildren, useCallback } from 'react'
import { Address } from 'viem'
import { minsToMs } from '@/lib/shared/hooks/useTime'
import { useSkipInitialQuery } from '@/lib/shared/hooks/useSkipInitialQuery'
import { getNativeAssetAddress, getWrappedNativeAssetAddress } from '@/lib/config/app.config'

export type UseTokensResult = ReturnType<typeof _useTokens>
export const TokensContext = createContext<UseTokensResult | null>(null)

export function _useTokens(
  initTokenData: GetTokensQuery,
  initTokenPricesData: GetTokenPricesQuery,
  variables: GetTokensQueryVariables
) {
  const skipQuery = useSkipInitialQuery(variables)

  // skip initial fetch on mount so that initialData is used
  const { data: tokensData } = useQuery(GetTokensDocument, {
    variables,
    skip: skipQuery,
  })
  const { data: tokenPricesData, loading: isLoadingTokenPrices } = useQuery(
    GetTokenPricesDocument,
    {
      variables,
      initialFetchPolicy: 'cache-only',
      nextFetchPolicy: 'cache-first',
      pollInterval: minsToMs(3),
      notifyOnNetworkStatusChange: true,
    }
  )

  const tokens = tokensData?.tokens || initTokenData.tokens
  const prices = tokenPricesData?.tokenPrices || initTokenPricesData.tokenPrices

  /*
    It can return undefined when the token address belongs to a pool token (not included in the provided tokens)
    // TODO: should we avoid calling getToken with pool tokens?
   */
  function getToken(address: string, chain: GqlChain | number): GqlToken | undefined {
    const chainKey = typeof chain === 'number' ? 'chainId' : 'chain'
    return tokens.find(token => isSameAddress(token.address, address) && token[chainKey] === chain)
  }

  function getNativeAssetToken(chain: GqlChain | number) {
    return getToken(getNativeAssetAddress(chain), chain)
  }

  function getWrappedNativeAssetToken(chain: GqlChain | number) {
    return getToken(getWrappedNativeAssetAddress(chain), chain)
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

  function usdValueForToken(token: GqlToken | undefined, amount: Numberish) {
    if (!token) return '0'
    if (amount === '') return '0'
    return bn(amount).times(priceForToken(token)).toFixed()
  }

  function priceFor(address: string, chain: GqlChain): number {
    const token = getToken(address, chain)
    if (!token) return 0

    return priceForToken(token)
  }

  const calcWeightForBalance = useCallback(
    (
      tokenAddress: Address | string,
      tokenBalance: string,
      totalLiquidity: string,
      chain: GqlChain
    ): string => {
      const tokenPrice = priceFor(tokenAddress, chain)

      return bn(tokenPrice).times(tokenBalance).div(totalLiquidity).toString()
    },
    []
  )

  return {
    tokens,
    prices,
    isLoadingTokenPrices,
    getToken,
    getNativeAssetToken,
    getWrappedNativeAssetToken,
    priceFor,
    priceForToken,
    getTokensByChain,
    getTokensByTokenAddress,
    usdValueForToken,
    calcWeightForBalance,
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
