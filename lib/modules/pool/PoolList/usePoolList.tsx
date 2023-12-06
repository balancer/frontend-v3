'use client'

import { createContext, ReactNode } from 'react'
import {
  GetPoolsDocument,
  GetPoolsQuery,
  GetPoolsQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { usePoolListQueryState } from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'
import { DecoratedPoolListItem } from '../pool.types'

export function _usePoolList() {
  const { queryVariables } = usePoolListQueryState()

  const { data, loading, previousData, refetch, networkStatus, error } = useQuery(
    GetPoolsDocument,
    { variables: queryVariables, notifyOnNetworkStatusChange: true }
  )

  let pools: DecoratedPoolListItem[]
  pools = loading && previousData ? previousData.pools : data?.pools || []

  pools = pools.map(pool => {
    if (pool.userBalance) {
      const bptPrice =
        parseFloat(pool.dynamicData.totalLiquidity) / parseFloat(pool.dynamicData.totalShares)
      return {
        ...pool,
        userBalance: {
          ...pool.userBalance,
          totalBalanceUsd: `${bptPrice * parseFloat(pool.userBalance.totalBalance)}`,
        },
      }
    } else {
      return pool
    }
  })

  return {
    pools,
    count: data?.count || previousData?.count,
    loading,
    error,
    networkStatus,
    refetch,
  }
}

export const PoolListContext = createContext<ReturnType<typeof _usePoolList> | null>(null)

export function PoolListProvider({
  children,
  data,
  variables,
}: {
  children: ReactNode
  data: GetPoolsQuery
  variables: GetPoolsQueryVariables
}) {
  useSeedApolloCache({
    query: GetPoolsDocument,
    data: data,
    variables,
  })

  const hook = _usePoolList()
  return <PoolListContext.Provider value={hook}>{children}</PoolListContext.Provider>
}

export function usePoolList() {
  return useMandatoryContext(PoolListContext, 'PoolList')
}
