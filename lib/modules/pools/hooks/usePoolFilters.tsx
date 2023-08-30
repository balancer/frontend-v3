'use client'

import { useState } from 'react'
import { PoolNetworkFilterForm, PoolTypeFilter, PoolTypeFilterForm } from '../pool.types'
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'
import { UNSUPPORTED_CHAINS } from '../../chains/chains.constants'

/**
 * POOL TYPE FILTER
 */
// We need to map toggalable pool types to their corresponding set of GqlPoolFilterTypes.
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

const allPoolTypes = Object.values(poolTypeFilters).flat()

/**
 * Takes the pool type filter form and returns an array of GqlPoolFilterTypes.
 * If no filters are toggled, returns all pool types.
 * @param {PoolTypeFilterForm} filters A map of toggled pool types.
 * @returns Array of GqlPoolFilterTypes
 */
export function getPoolTypeArgs(filters: PoolTypeFilterForm | null): GqlPoolFilterType[] {
  if (!filters) return allPoolTypes

  const toggledFilterTypes = Object.keys(filters).filter(
    key => filters[key as PoolTypeFilter]
  ) as PoolTypeFilter[]

  const toggledPoolTypes = toggledFilterTypes.reduce(
    (acc, toggledPoolType) => [...acc, ...poolTypeFilters[toggledPoolType]],
    [] as GqlPoolFilterType[]
  )

  if (toggledPoolTypes.length === 0) return allPoolTypes
  return toggledPoolTypes
}

// The default map of pool type filters, all set to false unless localstorage
// values provided.
export const defaultPoolTypeFilters = Object.fromEntries(
  Object.keys(poolTypeFilters).map(poolTypeFilter => [poolTypeFilter, false])
) as PoolTypeFilterForm

/**
 * POOL NETWORK FILTER
 */

/**
 * Takes the pool network filter form and returns an array of GqlChains.
 * If no filters are toggled, returns all chains.
 *
 * @param {PoolNetworkFilterForm} filters A map of toggled chains.
 * @returns Array of GqlChains
 */
export function getPoolNetworkArgs(filters: PoolNetworkFilterForm | null): GqlChain[] {
  if (!filters) return Object.keys(defaultPoolNetworkFilters) as GqlChain[]

  const networkFilters = Object.keys(filters).filter(key => filters[key as GqlChain]) as GqlChain[]

  if (networkFilters.length === 0) return Object.keys(filters) as GqlChain[]
  return networkFilters
}

// The default map of pool network filters, all set to false unless localstorage
// values provided.
export const defaultPoolNetworkFilters = Object.fromEntries(
  Object.keys(GqlChain)
    .filter(chain => !UNSUPPORTED_CHAINS.includes(chain.toUpperCase() as GqlChain))
    .map(key => [key.toUpperCase(), false])
) as PoolNetworkFilterForm

/**
 * Pool filters hook that provides the state.
 */
export function usePoolFilters() {
  const poolTypeFilterState = useState<PoolTypeFilterForm>(defaultPoolTypeFilters)
  const poolNetworkFilterState = useState<PoolNetworkFilterForm>(defaultPoolNetworkFilters)

  return {
    poolTypeFilterState,
    poolNetworkFilterState,
  }
}
