'use client'

import { GetFeaturedPoolsQuery } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { createContext, ReactNode } from 'react'

export function _useFeaturedPools(data: GetFeaturedPoolsQuery) {
  return {
    featuredPools: data.featuredPools,
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
