'use client'

import { createContext, ReactNode, useState } from 'react'
import {
  GetPoolsDocument,
  GetPoolsQuery,
  GetPoolsQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { usePoolListQueryState } from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'

export function _usePoolList() {
  const { queryVariables } = usePoolListQueryState()
  const [poolIds, setPoolIds] = useState<string[] | undefined>(undefined)

  const variables = {
    ...queryVariables,
    where: {
      ...queryVariables.where,
      idIn: poolIds,
    },
  }

  const { data, loading, previousData, refetch, networkStatus, error } = useQuery(
    GetPoolsDocument,
    { variables, notifyOnNetworkStatusChange: true }
  )

  const pools = loading && previousData ? previousData.pools : data?.pools || []

  return {
    pools,
    count: data?.count || previousData?.count,
    loading,
    error,
    networkStatus,
    poolIds,
    setPoolIds,
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
