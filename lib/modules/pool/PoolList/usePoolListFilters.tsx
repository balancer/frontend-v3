'use client'

import { useEffect, useMemo, useState } from 'react'
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'
import { uniq } from 'lodash'

// We need to map toggalable pool types to their corresponding set of GqlPoolFilterTypes.
export const POOL_TYPE_MAP: { [key: string]: GqlPoolFilterType[] } = {
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

export function usePoolFilters() {
  const [networks, setNetworks] = useState<GqlChain[]>([])
  const [poolTypes, setPoolTypes] = useState<GqlPoolFilterType[]>([])
  const [searchText, setSearchText] = useState<string>('')

  // Set internal checked state
  function toggleNetwork(checked: boolean, network: GqlChain) {
    if (checked) {
      setNetworks(uniq([...networks, network]))
    } else {
      setNetworks(networks.filter(chain => chain !== network))
    }
  }

  // Set internal checked state
  function togglePoolType(checked: boolean, poolType: GqlPoolFilterType) {
    if (checked) {
      setPoolTypes(uniq([...poolTypes, poolType]))
    } else {
      setPoolTypes(poolTypes.filter(type => type !== poolType))
    }
  }

  function poolTypeLabel(poolType: GqlPoolFilterType) {
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

  const mappedPoolTypes = useMemo(
    () => poolTypes.map(poolType => POOL_TYPE_MAP[poolType]).flat(),
    [poolTypes]
  )

  const totalFilterCount = networks.length + poolTypes.length

  useEffect(() => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    const _poolTypes = params.get('poolTypes')
    const _networks = params.get('networks')
    // const _searchText = params.get('search')

    if (_poolTypes) setPoolTypes(_poolTypes.split(',') as GqlPoolFilterType[])
    if (_networks) setNetworks(_networks.split(',') as GqlChain[])
    // if (_searchText) setSearchText(_searchText)
  }, [])

  return {
    networks,
    toggleNetwork,
    poolTypes,
    poolTypeFilters,
    mappedPoolTypes,
    togglePoolType,
    poolTypeLabel,
    searchText,
    setSearchText,
    totalFilterCount,
  }
}

// // On first render, we want to parse the URL query params and set the initial state.
// useEffect(() => {
//   const url = new URL(window.location.href)
//   const params = new URLSearchParams(url.search)
//   const _poolTypes = params.get('poolTypes')
//   const _networks = params.get('networks')
//   const _searchText = params.get('search')

//   if (_poolTypes) setPoolTypes(_poolTypes.split(',') as GqlPoolFilterType[])
//   if (_networks) setNetworks(_networks.split(',') as GqlChain[])
//   if (_searchText) setSearchText(_searchText)
// }, [])

// // On subsequent renders when filters change, we want to update the URL query params.
// useEffect(() => {
//   const url = new URL(window.location.href)
//   const params = new URLSearchParams(url.search)

//   if (poolTypes.length > 0) params.set('poolTypes', poolTypes.join(','))
//   else params.delete('poolTypes')

//   if (networks.length > 0) params.set('networks', networks.join(','))
//   else params.delete('networks')

//   if (searchText.length > 0) params.set('search', searchText)
//   else params.delete('search')

//   const searchParams = params.size > 0 ? `?${params.toString()}` : ''
//   window.history.pushState({}, '', `${url.pathname}${searchParams}`)
// }, [poolTypes, networks, searchText])
