'use client'

import {
  GetPoolsDocument,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { createContext, PropsWithChildren, useContext } from 'react'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import {
  defaultPoolNetworkFilters,
  defaultPoolTypeFilters,
  getPoolNetworkArgs,
  getPoolTypeArgs,
  usePoolFilters,
} from './usePoolFilters'
import { NUM_PER_PAGE, PAGE_NUM, usePoolPagination } from './usePoolPagination'

export type UsePoolsResponse = ReturnType<typeof _usePools>
export const PoolsContext = createContext<UsePoolsResponse | null>(null)

/**
 * Uses useSuspenseQuery to seed the client cache with initial pool data on the SSR pass.
 */
export const useSeedPoolsCacheQuery = () => {
  return useSuspenseQuery(GetPoolsDocument, {
    variables: {
      first: NUM_PER_PAGE,
      skip: PAGE_NUM,
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
  const pagination = usePoolPagination()
  const poolFilters = usePoolFilters()

  const {
    poolTypeFilterState: [poolTypeFilters],
    poolNetworkFilterState: [poolNetworkFilters],
  } = poolFilters

  const { data, loading, previousData } = useQuery(GetPoolsDocument, {
    variables: {
      first: pagination.numPerPage,
      skip: pagination.pageNum * pagination.numPerPage,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where: {
        chainIn: getPoolNetworkArgs(poolNetworkFilters),
        poolTypeIn: getPoolTypeArgs(poolTypeFilters),
      },
    },
  })

  const pools = loading && previousData ? previousData.pools : data?.pools || []

  return {
    pools,
    loading,
    pagination,
    poolFilters,
  }
}

export function PoolsProvider({ children }: PropsWithChildren) {
  const pools = _usePools()
  return <PoolsContext.Provider value={pools}>{children}</PoolsContext.Provider>
}

export const usePools = () => useContext(PoolsContext) as UsePoolsResponse
