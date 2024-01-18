'use client'

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'
import {
  GetFeaturedPoolsDocument,
  GetFeaturedPoolsQuery,
  GetFeaturedPoolsQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { createContext, ReactNode } from 'react'

export function _usePoolListFeaturedPools() {
  const { supportedNetworks } = getProjectConfig()
  const { data, loading, networkStatus, error } = useQuery(GetFeaturedPoolsDocument, {
    variables: { chains: supportedNetworks },
  })

  return {
    featuredPools: data?.featuredPools || [],
    loading,
    error,
    networkStatus,
  }
}

export const PoolListFeaturedPoolsContext = createContext<ReturnType<
  typeof _usePoolListFeaturedPools
> | null>(null)

export function PoolListFeaturedPoolsProvider({
  children,
  data,
  variables,
}: {
  children: ReactNode
  data: GetFeaturedPoolsQuery
  variables: GetFeaturedPoolsQueryVariables
}) {
  useSeedApolloCache({
    query: GetFeaturedPoolsDocument,
    data,
    variables,
  })

  const hook = _usePoolListFeaturedPools()
  return (
    <PoolListFeaturedPoolsContext.Provider value={hook}>
      {children}
    </PoolListFeaturedPoolsContext.Provider>
  )
}

export function usePoolListFeaturedPools() {
  return useMandatoryContext(PoolListFeaturedPoolsContext, 'PoolListFeaturedPools')
}
