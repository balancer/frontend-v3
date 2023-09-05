'use client'

import { PropsWithChildren, createContext, useState, useContext } from 'react'
import { GqlChain, GqlPoolFilterType } from '@/lib/services/api/generated/graphql'
import { uniq } from 'lodash'
import { useProjectConfig } from '@/lib/config/useProjectConfig'

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

/**
 * Pool filters hook that provides the state.
 */
function _usePoolFilters() {
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

  const mappedPoolTypes = poolTypes.map(poolType => POOL_TYPE_MAP[poolType]).flat()

  const totalFilterCount = poolTypes.length + networks.length

  return {
    poolTypes,
    mappedPoolTypes,
    networks,
    poolTypeFilters,
    networkFilters: supportedNetworks,
    totalFilterCount,
    addPoolTypeFilter,
    removePoolTypeFilter,
    addNetworkFilter,
    removeNetworkFilter,
  }
}

export type UsePoolFiltersResponse = ReturnType<typeof _usePoolFilters>
export const PoolFiltersContext = createContext<UsePoolFiltersResponse | null>(null)

export function PoolFiltersProvider({ children }: PropsWithChildren) {
  const hook = _usePoolFilters()
  return <PoolFiltersContext.Provider value={hook}>{children}</PoolFiltersContext.Provider>
}

export const usePoolFilters = () => useContext(PoolFiltersContext) as UsePoolFiltersResponse
