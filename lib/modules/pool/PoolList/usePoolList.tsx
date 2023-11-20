'use client'

import { createContext, ReactNode } from 'react'
import {
  GetPoolsDocument,
  GetPoolsQuery,
  GetPoolsQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { usePoolListQueryState } from './usePoolListQueryState'

export function _usePoolList() {
  const { queryVariables } = usePoolListQueryState()

  const { data, loading, previousData, refetch, networkStatus, error } = useQuery(
    GetPoolsDocument,
    { variables: queryVariables, notifyOnNetworkStatusChange: true }
  )

  const pools = loading && previousData ? previousData.pools : data?.pools || []

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
