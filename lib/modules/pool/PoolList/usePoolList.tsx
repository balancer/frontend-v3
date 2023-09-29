'use client'

import { makeVar, useReactiveVar } from '@apollo/client'
import { createContext, ReactNode, useCallback } from 'react'
import {
  GetPoolsDocument,
  GetPoolsQueryVariables,
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { useMandatoryContext } from '@/lib/utils/contexts'

interface PoolsQueryVariables extends GetPoolsQueryVariables {
  first: number
  skip: number
}

export const DEFAULT_POOL_LIST_QUERY_VARS: PoolsQueryVariables = {
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
}

const poolListStateVar = makeVar<PoolsQueryVariables>(DEFAULT_POOL_LIST_QUERY_VARS)

export function _usePoolList() {
  const state = useReactiveVar(poolListStateVar)

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

  const setNetworks = useCallback(
    (networks: GqlChain[]) =>
      setNewState({
        where: {
          chainIn: networks.length === 0 ? PROJECT_CONFIG.supportedNetworks : networks,
        },
      }),
    []
  )

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

  return {
    state,
    pools,
    count: data?.count || previousData?.count,
    loading,
    error,
    networkStatus,
    refetch,
    setNetworks,
    setPoolTypes,
  }
}

export function usePoolListSeedCacheQuery() {
  return useSuspenseQuery(GetPoolsDocument, {
    variables: DEFAULT_POOL_LIST_QUERY_VARS,
  })
}

export const PoolListContext = createContext<ReturnType<typeof _usePoolList> | null>(null)

export function PoolListProvider(props: { children: ReactNode }) {
  const value = _usePoolList()

  return <PoolListContext.Provider value={value}>{props.children}</PoolListContext.Provider>
}

export function usePoolList() {
  return useMandatoryContext(PoolListContext, 'PoolList')
}
