'use client'

import { useState } from 'react'
import { PoolNetworkFilterForm, PoolTypeFilterForm } from '../../pool.types'
import { defaultPoolNetworkFilters, defaultPoolTypeFilters } from './pool-filters'

export function usePoolFilters() {
  const poolTypeFilterState = useState<PoolTypeFilterForm>(defaultPoolTypeFilters)
  const poolNetworkFilterState = useState<PoolNetworkFilterForm>(defaultPoolNetworkFilters)

  return {
    poolTypeFilterState,
    poolNetworkFilterState,
  }
}
