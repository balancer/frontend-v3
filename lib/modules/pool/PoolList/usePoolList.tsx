'use client'

import { createContext, ReactNode } from 'react'
import {
  GetPoolsDocument,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { usePoolListQueryState } from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { PROJECT_CONFIG } from '@/lib/config/useProjectConfig'

export function _usePoolList() {
  const { state, mappedPoolTypes } = usePoolListQueryState()

  const { data, loading, previousData, refetch, networkStatus, error } = useQuery(
    GetPoolsDocument,
    {
      variables: {
        first: state.first,
        skip: state.skip,
        orderBy: state.orderBy,
        orderDirection: state.orderDirection,
        where: {
          poolTypeIn: mappedPoolTypes,
          chainIn: state.networks,
        },
        textSearch: state.textSearch,
      },
      notifyOnNetworkStatusChange: true,
    }
  )

  const pools = loading && previousData ? previousData.pools : data?.pools || []

  return {
    pools,
    count: data?.count,
    loading,
    error,
    networkStatus,
    refetch,
  }
}

export function usePoolListSeedCacheQuery() {
  //const { state } = usePoolListQueryState()

  return useSuspenseQuery(GetPoolsDocument, {
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
        ],
        chainIn: PROJECT_CONFIG.supportedNetworks,
      },
      textSearch: null,
    },
  })
}

export const PoolListContext = createContext<ReturnType<typeof _usePoolList> | null>(null)

export function PoolListProvider(props: { children: ReactNode }) {
  const hook = _usePoolList()
  return <PoolListContext.Provider value={hook}>{props.children}</PoolListContext.Provider>
}

export function usePoolList() {
  return useMandatoryContext(PoolListContext, 'PoolList')
}
