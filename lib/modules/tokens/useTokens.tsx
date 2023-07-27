'use client'

import { GetAppGlobalDataDocument } from '@/lib/services/api/generated/graphql'
import { createContext, PropsWithChildren, useContext } from 'react'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'

export const TokensContext = createContext<ReturnType<
  typeof _useTokens
> | null>(null)

function _useTokens() {
  const globalDataQuery = useQuery(GetAppGlobalDataDocument)

  const tokens = globalDataQuery.data?.tokenGetTokens || []

  return { tokens }
}

export function TokensProvider({ children }: PropsWithChildren) {
  const tokens = _useTokens()
  return (
    <TokensContext.Provider value={tokens}>{children}</TokensContext.Provider>
  )
}

export const useTokens = () =>
  useContext(TokensContext) as ReturnType<typeof _useTokens>
