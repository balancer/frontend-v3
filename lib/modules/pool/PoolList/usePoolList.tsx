'use client'

import { createContext, ReactNode, useRef } from 'react'
import {
  GetPoolsDocument,
  GetPoolsQuery,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/shared/services/api/generated/graphql'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { usePoolListQueryState } from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useApolloClient } from '@apollo/client'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'

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

export function usePoolListSeedCacheQuery() {
  const { queryVariables } = usePoolListQueryState()
  // We store the search params in a ref so that they do not update.
  // This ensure that the suspense query will only get called once. during
  // the server side rendering pass.
  const storedVariables = useRef(queryVariables).current

  return useSuspenseQuery(GetPoolsDocument, {
    variables: storedVariables,
    context: {
      fetchOptions: {
        next: { revalidate: 30 },
      },
    },
  })
}

export const PoolListContext = createContext<ReturnType<typeof _usePoolList> | null>(null)

export function PoolListProvider({ children, data }: { children: ReactNode; data: GetPoolsQuery }) {
  useSeedApolloCache({
    query: GetPoolsDocument,
    data: data,
    variables: {
      first: 20,
      skip: 0,
      orderBy: GqlPoolOrderBy.TotalLiquidity,
      orderDirection: GqlPoolOrderDirection.Desc,
      where: {
        poolTypeIn: [
          GqlPoolFilterType.Weighted,
          GqlPoolFilterType.Stable,
          GqlPoolFilterType.PhantomStable,
          GqlPoolFilterType.MetaStable,
          GqlPoolFilterType.Gyro,
          GqlPoolFilterType.Gyro3,
          GqlPoolFilterType.Gyroe,
          GqlPoolFilterType.LiquidityBootstrapping,
        ],
        chainIn: PROJECT_CONFIG.supportedNetworks,
      },
      textSearch: null,
    },
  })

  const hook = _usePoolList()
  return <PoolListContext.Provider value={hook}>{children}</PoolListContext.Provider>
}

export function usePoolList() {
  return useMandatoryContext(PoolListContext, 'PoolList')
}
