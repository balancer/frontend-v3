'use client'

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { useSkipInitialQuery } from '@/lib/shared/hooks/useSkipInitialQuery'
import {
  GetFeaturedPoolsDocument,
  GetFeaturedPoolsQuery,
} from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { createContext, ReactNode } from 'react'

export function _useFeaturedPools(initialData: GetFeaturedPoolsQuery) {
  const { supportedNetworks } = getProjectConfig()
  const queryVariables = { chains: supportedNetworks }
  const skipQuery = useSkipInitialQuery(queryVariables)

  const { data, loading, networkStatus, error } = useQuery(GetFeaturedPoolsDocument, {
    variables: queryVariables,
    skip: skipQuery,
  })

  return {
    featuredPools: data?.featuredPools || initialData.featuredPools,
    loading,
    error,
    networkStatus,
  }
}

export const FeaturedPoolsContext = createContext<ReturnType<typeof _useFeaturedPools> | null>(null)

export function FeaturedPoolsProvider({
  children,
  data,
}: {
  children: ReactNode
  data: GetFeaturedPoolsQuery
}) {
  const hook = _useFeaturedPools(data)

  return <FeaturedPoolsContext.Provider value={hook}>{children}</FeaturedPoolsContext.Provider>
}

export function useFeaturedPools() {
  return useMandatoryContext(FeaturedPoolsContext, 'FeaturedPools')
}
