'use client'

import { GetPoolsDocument } from '@/lib/services/api/generated/graphql'
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
import { DEFAULT_ORDER_BY, DEFAULT_ORDER_DIRECTION, usePoolSorting } from './usePoolSorting'

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
      orderBy: DEFAULT_ORDER_BY,
      orderDirection: DEFAULT_ORDER_DIRECTION,
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
  const { sorting, setSorting, orderBy, orderDirection } = usePoolSorting()

  const {
    poolTypeFilterState: [poolTypeFilters],
    poolNetworkFilterState: [poolNetworkFilters],
  } = poolFilters

  const { data, loading, previousData } = useQuery(GetPoolsDocument, {
    variables: {
      first: pagination.numPerPage,
      skip: pagination.pageNum * pagination.numPerPage,
      orderBy: orderBy,
      orderDirection: orderDirection,
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
    sorting,
    setSorting,
  }
}

export function PoolsProvider({ children }: PropsWithChildren) {
  const pools = _usePools()
  return <PoolsContext.Provider value={pools}>{children}</PoolsContext.Provider>
}

export const usePools = () => useContext(PoolsContext) as UsePoolsResponse
