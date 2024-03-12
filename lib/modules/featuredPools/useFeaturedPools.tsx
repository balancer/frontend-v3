'use client'

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'
import {
  GetFeaturedPoolsDocument,
  GetFeaturedPoolsQuery,
  GetFeaturedPoolsQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useQuery } from '@apollo/client'
import { createContext, ReactNode } from 'react'

export function _useFeaturedPools() {
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

export const FeaturedPoolsContext = createContext<ReturnType<typeof _useFeaturedPools> | null>(null)

export function FeaturedPoolsProvider({
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

  const hook = _useFeaturedPools()
  return <FeaturedPoolsContext.Provider value={hook}>{children}</FeaturedPoolsContext.Provider>
}

export function useFeaturedPools() {
  return useMandatoryContext(FeaturedPoolsContext, 'FeaturedPools')
}
