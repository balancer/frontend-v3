'use client'

import { createContext, ReactNode } from 'react'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { useQuery } from '@tanstack/react-query'

const fetchFeaturedPoolIds = async () => {
  const response = await fetch(
    'https://raw.githubusercontent.com/balancer/metadata/main/pools/featured.json'
  )
  return response.json()
}

export function _useFeaturedPools() {
  const { data, loading } = useQuery('featuredPoolIds', fetchFeaturedPoolIds)

  return {}
}

export function useFeaturedPoolsSeedCacheQuery() {
  return useSuspenseQuery(GetPoolsDocument)
}

export const FeaturedPoolsContext = createContext<ReturnType<typeof _useFeaturedPools> | null>(null)

export function FeaturedPoolsProvider(props: { children: ReactNode }) {
  const hook = _useFeaturedPools()
  return (
    <FeaturedPoolsContext.Provider value={hook}>{props.children}</FeaturedPoolsContext.Provider>
  )
}

export function useFeeaturedPools() {
  return useMandatoryContext(FeaturedPoolsContext, 'FeaturedPools')
}
