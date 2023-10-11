'use client'

import { GetTokensDocument, GqlToken } from '@/lib/services/api/generated/graphql'
import { isSameAddress } from '@/lib/utils/addresses'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { PropsWithChildren, createContext } from 'react'

export type UseTokensResult = ReturnType<typeof _useTokens>
export const TokensContext = createContext<UseTokensResult | null>(null)

export function _useTokens() {
  const { data } = useQuery(GetTokensDocument)

  const tokens = data?.tokens || []

  function getToken(address: string, chainId: number): GqlToken | undefined {
    return tokens.find(token => isSameAddress(token.address, address) && token.chainId === chainId)
  }

  return { tokens, getToken }
}

export function TokensProvider({ children }: PropsWithChildren) {
  const tokens = _useTokens()
  return <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>
}

export const useTokens = (): UseTokensResult => useMandatoryContext(TokensContext, 'Tokens')
