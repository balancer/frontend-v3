'use client'

import { createContext, ReactNode, useRef } from 'react'
import { GetPoolsDocument } from '@/lib/services/api/generated/graphql'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import {
  poolListQueryMapPoolFiltersToTypes,
  poolListQueryParamsConfigMap,
  usePoolListQueryState,
} from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { decodeQueryParams } from 'use-query-params'
import { NextSearchParams } from '@/lib/global/global.types'

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
          chainIn: state.networks.length > 0 ? state.networks : PROJECT_CONFIG.supportedNetworks,
        },
        textSearch: state.textSearch,
      },
      notifyOnNetworkStatusChange: true,
    }
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

export function usePoolListSeedCacheQuery(searchParams: NextSearchParams) {
  // We store the search params in a ref so that they do not update.
  // This ensure that the suspense query will only get called once. during
  // the server side rendering pass.
  const decoded = useRef(decodeQueryParams(poolListQueryParamsConfigMap, searchParams)).current
  const networks = decoded.networks || []
  const mappedPoolTypes = poolListQueryMapPoolFiltersToTypes(decoded.poolTypes || [])

  return useSuspenseQuery(GetPoolsDocument, {
    variables: {
      first: decoded.first,
      skip: decoded.skip,
      orderBy: decoded.orderBy,
      orderDirection: decoded.orderDirection,
      where: {
        poolTypeIn: mappedPoolTypes,
        chainIn: networks.length > 0 ? networks : PROJECT_CONFIG.supportedNetworks,
      },
      textSearch: decoded.textSearch,
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
