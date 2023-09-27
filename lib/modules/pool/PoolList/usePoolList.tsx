'use client'

import { makeVar, useReactiveVar } from '@apollo/client'
import { createContext, ReactNode, useCallback } from 'react'
import {
  GetPoolsDocument,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { PROJECT_CONFIG } from '@/lib/config/useProjectConfig'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { PoolsColumnSort, PoolsQueryVariables } from '@/lib/modules/pool/pool.types'
import { usePoolFilters } from './usePoolListFilters'
import {
  DEFAULT_POOL_LIST_QUERY_VARS,
  PoolListUrlParams,
  getInitQueryState,
  useQueryVarsWatcher,
} from './queryVars'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { ReadonlyURLSearchParams } from 'next/navigation'

const poolListStateVar = makeVar<PoolsQueryVariables>(DEFAULT_POOL_LIST_QUERY_VARS)

export function _usePoolList() {
  const state = useReactiveVar(poolListStateVar)
  const poolFilters = usePoolFilters()

  function setNewState(newState: Partial<PoolsQueryVariables>) {
    const state = poolListStateVar()

    poolListStateVar({
      ...state,
      ...newState,
      where: {
        ...state.where,
        ...newState.where,
      },
    })
  }

  function setSort(sortingState: PoolsColumnSort[]) {
    if (sortingState.length > 0) {
      setNewState({
        orderBy: sortingState[0].id,
        orderDirection: sortingState[0].desc
          ? GqlPoolOrderDirection.Desc
          : GqlPoolOrderDirection.Asc,
      })
    } else {
      setNewState({
        orderBy: GqlPoolOrderBy.TotalLiquidity,
        orderDirection: GqlPoolOrderDirection.Desc,
      })
    }
  }

  function setPageSize(pageSize: number) {
    setNewState({
      skip: 0,
      first: pageSize,
    })
  }

  function setPageNumber(pageNumber: number) {
    const state = poolListStateVar()
    setNewState({
      skip: pageNumber * state.first,
    })
  }

  function setSearch(text: string) {
    setNewState({
      skip: 0,
      textSearch: text,
    })
  }

  const setNetworks = useCallback((networks: GqlChain[]) => {
    console.log('set networks', networks)

    setNewState({
      where: {
        chainIn: networks.length === 0 ? PROJECT_CONFIG.supportedNetworks : networks,
      },
    })
  }, [])

  const setPoolTypes = useCallback(
    (poolTypes: GqlPoolFilterType[]) =>
      setNewState({
        where: {
          poolTypeIn:
            poolTypes.length === 0 ? DEFAULT_POOL_LIST_QUERY_VARS.where?.poolTypeIn : poolTypes,
        },
      }),
    []
  )

  const { data, loading, previousData, refetch, networkStatus, error } = useQuery(
    GetPoolsDocument,
    {
      variables: state,
      notifyOnNetworkStatusChange: true,
    }
  )

  const pools = loading && previousData ? previousData.pools : data?.pools || []

  const sorting: PoolsColumnSort[] = state.orderBy
    ? [{ id: state.orderBy, desc: state.orderDirection === GqlPoolOrderDirection.Desc }]
    : []

  const pageNumber = state.skip / state.first
  const pageSize = state.first

  useQueryVarsWatcher([
    {
      key: PoolListUrlParams.PoolTypes,
      value: poolFilters.poolTypes.join(','),
    },
    {
      key: PoolListUrlParams.Networks,
      value: poolFilters.networks.join(','),
    },
    {
      key: PoolListUrlParams.Search,
      value: poolFilters.searchText,
    },
    {
      key: PoolListUrlParams.Skip,
      value: state.skip.toString(),
      shouldSet: () => state.skip !== 0,
    },
    {
      key: PoolListUrlParams.First,
      value: state.first.toString(),
      shouldSet: () => state.first !== 20,
    },
    {
      key: PoolListUrlParams.SortBy,
      value: state.orderBy || '',
      shouldSet: () => state.orderBy !== GqlPoolOrderBy.TotalLiquidity,
    },
    {
      key: PoolListUrlParams.SortDir,
      value: state.orderDirection || '',
      shouldSet: () => state.orderDirection !== GqlPoolOrderDirection.Desc,
    },
  ])

  return {
    state,
    pools,
    count: data?.count,
    loading,
    error,
    networkStatus,
    refetch,
    setPageSize,
    setPageNumber,
    pageNumber,
    pageSize,
    sorting,
    setSort,
    setNetworks,
    setPoolTypes,
    setSearch,
    poolFilters,
  }
}

export function usePoolListSeedCacheQuery(searchParams: ReadonlyURLSearchParams) {
  return useSuspenseQuery(GetPoolsDocument, {
    variables: getInitQueryState(searchParams),
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
