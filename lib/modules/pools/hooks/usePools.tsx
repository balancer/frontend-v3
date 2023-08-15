'use client'

import {
  GetPoolsDocument,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import {
  defaultPoolNetworkFilters,
  defaultPoolTypeFilters,
  getPoolNetworkArgs,
  getPoolTypeArgs,
  usePoolFilters,
} from './usePoolFilters'

export type UsePoolsResponse = ReturnType<typeof _usePools>
export const PoolsContext = createContext<UsePoolsResponse | null>(null)

/**
 * Uses useSuspenseQuery to seed the client cache with initial pool data on the SSR pass.
 */
export const useSeedPoolsCacheQuery = () => {
  return useSuspenseQuery(GetPoolsDocument, {
    variables: {
      first: 10,
      skip: 0,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where: {
        chainIn: getPoolNetworkArgs(defaultPoolNetworkFilters),
        poolTypeIn: getPoolTypeArgs(defaultPoolTypeFilters),
      },
    },
  })
}

function _usePools() {
  const [numPerPage, setNumPerPage] = useState(10)
  const [pageNum, setPageNum] = useState(0)
  const poolFilters = usePoolFilters()

  const {
    poolTypeFilterState: [poolTypeFilters],
    poolNetworkFilterState: [poolNetworkFilters],
  } = poolFilters

  const { data, refetch, loading, previousData } = useQuery(GetPoolsDocument, {
    variables: {
      first: numPerPage,
      skip: pageNum * numPerPage,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where: {
        chainIn: getPoolNetworkArgs(poolNetworkFilters),
        poolTypeIn: getPoolTypeArgs(poolTypeFilters),
      },
    },
  })

  useEffect(() => {
    refetch({ first: numPerPage, skip: pageNum * numPerPage })
  }, [numPerPage, pageNum, refetch])

  const pools = loading && previousData ? previousData.pools : data?.pools || []

  return {
    pools,
    loading,
    numPerPage,
    setNumPerPage,
    pageNum,
    setPageNum,
    poolFilters,
  }
}

export function PoolsProvider({ children }: PropsWithChildren) {
  const pools = _usePools()
  return <PoolsContext.Provider value={pools}>{children}</PoolsContext.Provider>
}

export const usePools = () => useContext(PoolsContext) as UsePoolsResponse
