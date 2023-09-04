'use client'

import { useState } from 'react'
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'
import { uniq } from 'lodash'
import { useProjectConfig } from '@/lib/config/useProjectConfig'

/**
 * POOL TYPE FILTER
 */
// We need to map toggalable pool types to their corresponding set of GqlPoolFilterTypes.
const poolTypeMap: { [key: string]: GqlPoolFilterType[] } = {
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

const poolTypeFilters = Object.keys(poolTypeMap) as GqlPoolFilterType[]

/**
 * Pool filters hook that provides the state.
 */
export function usePoolFilters() {
  const { supportedNetworks } = useProjectConfig()
  const [poolTypes, setPoolTypes] = useState<GqlPoolFilterType[]>([])
  const [networks, setNetworks] = useState<GqlChain[]>([])

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

  const mappedPoolTypes = poolTypes.map(poolType => poolTypeMap[poolType]).flat()

  return {
    poolTypes,
    mappedPoolTypes,
    networks,
    poolTypeFilters,
    networkFilters: supportedNetworks,
    addPoolTypeFilter,
    removePoolTypeFilter,
    addNetworkFilter,
    removeNetworkFilter,
  }
}
