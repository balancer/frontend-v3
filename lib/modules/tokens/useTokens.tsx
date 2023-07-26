'use client'

import { apolloClient } from '@/lib/services/api/apollo.client'
import { GetAppGlobalDataDocument } from '@/lib/services/api/generated/graphql'
import { useQuery } from '@apollo/client'
import { PropsWithChildren, createContext, useContext } from 'react'

export const TokensContext = createContext<ReturnType<
  typeof _useTokens
> | null>(null)

function _useTokens() {
  const client = apolloClient()
  const globalDataQuery = useQuery(GetAppGlobalDataDocument, { client })

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
