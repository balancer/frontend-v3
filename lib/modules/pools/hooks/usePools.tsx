'use client'

import { GetPoolsDocument, GetPoolsQuery } from '@/lib/services/api/generated/graphql'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { usePoolFilters } from './usePoolFilters/usePoolFilters'
import { usePoolPagination } from './usePoolPagination'
import { usePoolSorting } from './usePoolSorting'
import { getPoolNetworkArgs, getPoolTypeArgs } from './usePoolFilters/pool-filters'
import { useApolloClient as apolloClient } from '@apollo/client'

export type UsePoolsResponse = ReturnType<typeof _usePools>
export const PoolsContext = createContext<UsePoolsResponse | null>(null)

function _usePools(initPools: GetPoolsQuery) {
  const pagination = usePoolPagination()
  const poolFilters = usePoolFilters()
  const [mounted, setMounted] = useState(false)
  const { sorting, setSorting, orderBy, orderDirection } = usePoolSorting()

  const {
    poolTypeFilterState: [poolTypeFilters],
    poolNetworkFilterState: [poolNetworkFilters],
  } = poolFilters

  const variables = {
    first: pagination.numPerPage,
    skip: pagination.pageNum * pagination.numPerPage,
    orderBy: orderBy,
    orderDirection: orderDirection,
    where: {
      chainIn: getPoolNetworkArgs(poolNetworkFilters),
      poolTypeIn: getPoolTypeArgs(poolTypeFilters),
    },
  }

  if (!mounted) {
    apolloClient().writeQuery({
      query: GetPoolsDocument,
      data: initPools,
      variables,
    })
    setMounted(true)
  }

  const { data, loading, previousData } = useQuery(GetPoolsDocument, {
    variables,
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

interface Props extends PropsWithChildren {
  initPools: GetPoolsQuery
}

export function PoolsProvider({ initPools, children }: Props) {
  const hook = _usePools(initPools)
  return <PoolsContext.Provider value={hook}>{children}</PoolsContext.Provider>
}

export const usePools = () => useContext(PoolsContext) as UsePoolsResponse
