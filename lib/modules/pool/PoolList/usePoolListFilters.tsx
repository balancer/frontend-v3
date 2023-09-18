'use client'

import { useMemo, useState } from 'react'
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'
import { uniq } from 'lodash'
import { InitQueryState } from './usePoolList.helpers'

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

export function usePoolFilters(initState: InitQueryState) {
  const { urlParams } = initState

  const [networks, setNetworks] = useState<GqlChain[]>(urlParams.networks)
  const [poolTypes, setPoolTypes] = useState<GqlPoolFilterType[]>(urlParams.poolTypes)
  const [searchText, setSearchText] = useState<string>(urlParams.searchText)

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
