'use client'

import { PropsWithChildren, createContext, useState, useEffect } from 'react'
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'
import { uniq } from 'lodash'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { useMandatoryContext } from '@/lib/utils/contexts'

// We need to map toggalable pool types to their corresponding set of GqlPoolFilterTypes.
const POOL_TYPE_MAP: { [key: string]: GqlPoolFilterType[] } = {
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

const poolTypeFilters = Object.keys(POOL_TYPE_MAP) as GqlPoolFilterType[]

function _usePoolListFilters() {
  const { supportedNetworks } = getProjectConfig()
  const [poolTypes, setPoolTypes] = useState<GqlPoolFilterType[]>([])
  const [networks, setNetworks] = useState<GqlChain[]>([])
  const [searchText, setSearchText] = useState<string>('')

  function addPoolTypeFilter(poolType: GqlPoolFilterType) {
    setPoolTypes(uniq([...poolTypes, poolType]))
  }

  function removePoolTypeFilter(poolType: GqlPoolFilterType) {
    setPoolTypes(poolTypes.filter(type => type !== poolType))
  }

  function addNetworkFilter(network: GqlChain) {
    setNetworks(uniq([...networks, network]))
  }

  function removeNetworkFilter(network: GqlChain) {
    setNetworks(networks.filter(chain => chain !== network))
  }

  function labelFor(poolType: GqlPoolFilterType) {
    switch (poolType) {
      case GqlPoolFilterType.Weighted:
        return 'Weighted'
      case GqlPoolFilterType.Stable:
        return 'Stable'
      case GqlPoolFilterType.LiquidityBootstrapping:
        return 'Liquidity Bootstrapping'
      case GqlPoolFilterType.Gyro:
        return 'CLP'
      default:
        return poolType.toLowerCase()
    }
  }

  const mappedPoolTypes = poolTypes.map(poolType => POOL_TYPE_MAP[poolType]).flat()

  const totalFilterCount = poolTypes.length + networks.length

  // On first render, we want to parse the URL query params and set the initial state.
  useEffect(() => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    const _poolTypes = params.get('poolTypes')
    const _networks = params.get('networks')
    const _searchText = params.get('search')

    if (_poolTypes) setPoolTypes(_poolTypes.split(',') as GqlPoolFilterType[])
    if (_networks) setNetworks(_networks.split(',') as GqlChain[])
    if (_searchText) setSearchText(_searchText)
  }, [])

  // On subsequent renders when filters change, we want to update the URL query params.
  useEffect(() => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    if (poolTypes.length > 0) params.set('poolTypes', poolTypes.join(','))
    else params.delete('poolTypes')

    if (networks.length > 0) params.set('networks', networks.join(','))
    else params.delete('networks')

    if (searchText.length > 0) params.set('search', searchText)
    else params.delete('search')

    const searchParams = params.size > 0 ? `?${params.toString()}` : ''
    window.history.pushState({}, '', `${url.pathname}${searchParams}`)
  }, [poolTypes, networks, searchText])

  return {
    poolTypes,
    mappedPoolTypes,
    networks,
    poolTypeFilters,
    networkFilters: supportedNetworks,
    totalFilterCount,
    searchText,
    setSearchText,
    addPoolTypeFilter,
    removePoolTypeFilter,
    addNetworkFilter,
    removeNetworkFilter,
    labelFor,
  }
}

export type UsePoolListFiltersResponse = ReturnType<typeof _usePoolListFilters>
export const PoolListFiltersContext = createContext<UsePoolListFiltersResponse | null>(null)

export function PoolFiltersProvider({ children }: PropsWithChildren) {
  const hook = _usePoolListFilters()
  return <PoolListFiltersContext.Provider value={hook}>{children}</PoolListFiltersContext.Provider>
}

export const usePoolListFilters = (): UsePoolListFiltersResponse =>
  useMandatoryContext(PoolListFiltersContext, 'PoolListFilters')
