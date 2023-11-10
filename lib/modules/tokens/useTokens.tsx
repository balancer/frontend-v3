'use client'

import {
  GetTokensDocument,
  GetTokensQuery,
  GetTokensQueryVariables,
  GqlToken,
} from '@/lib/shared/services/api/generated/graphql'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { createContext, PropsWithChildren } from 'react'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'

export type UseTokensResult = ReturnType<typeof _useTokens>
export const TokensContext = createContext<UseTokensResult | null>(null)

export function _useTokens(initialData: GetTokensQuery, variables: GetTokensQueryVariables) {
  const { data } = useQuery(GetTokensDocument, { variables })

  const tokens = data?.tokens || initialData.tokens

  function getToken(address: string, chainId: number): GqlToken | undefined {
    return tokens.find(token => isSameAddress(token.address, address) && token.chainId === chainId)
  }

  return { tokens, getToken }
}

export function TokensProvider({
  children,
  data,
  variables,
}: PropsWithChildren & { data: GetTokensQuery; variables: GetTokensQueryVariables }) {
  useSeedApolloCache({
    query: GetTokensDocument,
    data,
    variables,
  })

  const tokens = _useTokens(data, variables)

  return <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>
}

export const useTokens = (): UseTokensResult => useMandatoryContext(TokensContext, 'Tokens')
