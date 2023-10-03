'use client'

import { createContext, ReactNode } from 'react'
import {
  GetPoolsDocument,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { PoolFilterType, usePoolListQueryState } from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'

// We need to map toggalable pool types to their corresponding set of GqlPoolFilterTypes.
const POOL_TYPE_MAP: { [key in PoolFilterType]: GqlPoolFilterType[] } = {
  [GqlPoolFilterType.Weighted]: [GqlPoolFilterType.Weighted],
  [GqlPoolFilterType.Stable]: [
    GqlPoolFilterType.Stable,
    GqlPoolFilterType.PhantomStable,
    GqlPoolFilterType.MetaStable,
    GqlPoolFilterType.Gyro,
    GqlPoolFilterType.Gyro3,
    GqlPoolFilterType.Gyroe,
  ],
  [GqlPoolFilterType.LiquidityBootstrapping]: [GqlPoolFilterType.LiquidityBootstrapping],
  [GqlPoolFilterType.Gyro]: [
    GqlPoolFilterType.Gyro,
    GqlPoolFilterType.Gyro3,
    GqlPoolFilterType.Gyroe,
  ],
}

export function _usePoolList() {
  const { state } = usePoolListQueryState()
  const poolTypes = (
    state.poolTypes.length > 0
      ? state.poolTypes
      : ([GqlPoolFilterType.Weighted, GqlPoolFilterType.Stable] as const)
  )
    .map(poolType => POOL_TYPE_MAP[poolType])
    .flat()

  const { data, loading, previousData, refetch, networkStatus, error } = useQuery(
    GetPoolsDocument,
    {
      variables: {
        first: state.first,
        skip: state.skip,
        orderBy: state.orderBy,
        orderDirection: state.orderDirection,
        where: {
          poolTypeIn: poolTypes,
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
