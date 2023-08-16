'use client'

import { useState } from 'react'
import { PoolNetworkFilterForm, PoolTypeFilter, PoolTypeFilterForm } from '../pool.types'
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'

const poolTypeFilters = {
  [PoolTypeFilter.Weighted]: [GqlPoolFilterType.Weighted],
  [PoolTypeFilter.Stable]: [
    GqlPoolFilterType.Stable,
    GqlPoolFilterType.PhantomStable,
    GqlPoolFilterType.MetaStable,
    GqlPoolFilterType.Gyro,
    GqlPoolFilterType.Gyro3,
    GqlPoolFilterType.Gyroe,
  ],
  [PoolTypeFilter.LiquidityBootstrapping]: [GqlPoolFilterType.LiquidityBootstrapping],
}

export function getPoolTypeArgs(filters: PoolTypeFilterForm | null): GqlPoolFilterType[] {
  if (!filters) {
    return Object.values(poolTypeFilters).flat() // All pool types
  }

  const toggledPoolTypes = Object.keys(filters).filter(
    key => filters[key as PoolTypeFilter]
  ) as PoolTypeFilter[]

  return toggledPoolTypes.reduce(
    (acc, toggledPoolType) => [...acc, ...poolTypeFilters[toggledPoolType]],
    [] as GqlPoolFilterType[]
  )
}

export function getPoolNetworkArgs(filters: PoolNetworkFilterForm | null): GqlChain[] {
  if (!filters) return Object.keys(defaultPoolNetworkFilters) as GqlChain[]

  return Object.keys(filters).filter(key => filters[key as GqlChain]) as GqlChain[]
}

export const defaultPoolTypeFilters = Object.fromEntries(
  Object.keys(poolTypeFilters).map(poolTypeFilter => [poolTypeFilter, true])
) as PoolTypeFilterForm

const unsuportedChains = [GqlChain.Fantom, GqlChain.Optimism]

export const defaultPoolNetworkFilters = Object.fromEntries(
  Object.keys(GqlChain)
    .filter(chain => !unsuportedChains.includes(chain.toUpperCase() as GqlChain))
    .map(key => [key.toUpperCase(), true])
) as PoolNetworkFilterForm

export function usePoolFilters() {
  const poolTypeFilterState = useState<PoolTypeFilterForm>(defaultPoolTypeFilters)
  const poolNetworkFilterState = useState<PoolNetworkFilterForm>(defaultPoolNetworkFilters)

  return {
    poolTypeFilterState,
    poolNetworkFilterState,
  }
}
