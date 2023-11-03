'use client'

import { createContext, ReactNode, useRef } from 'react'
import { GetPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { usePoolListQueryState } from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'

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

export function usePoolListSeedCacheQuery() {
  const { state, mappedPoolTypes } = usePoolListQueryState()
  // We store the search params in a ref so that they do not update.
  // This ensure that the suspense query will only get called once. during
  // the server side rendering pass.
  const storedState = useRef(state).current
  const storedMappedPoolTypes = useRef(mappedPoolTypes).current

  return useSuspenseQuery(GetPoolsDocument, {
    variables: {
      first: storedState.first,
      skip: storedState.skip,
      orderBy: storedState.orderBy,
      orderDirection: storedState.orderDirection,
      where: {
        poolTypeIn: storedMappedPoolTypes,
        chainIn:
          storedState.networks.length > 0 ? storedState.networks : PROJECT_CONFIG.supportedNetworks,
      },
      textSearch: storedState.textSearch,
    },
    context: {
      fetchOptions: {
        next: { revalidate: 10 },
      },
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
