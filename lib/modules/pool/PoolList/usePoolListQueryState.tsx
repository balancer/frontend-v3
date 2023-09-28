'use client'

import { useMemo } from 'react'
import {
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { isEqual, uniq } from 'lodash'
import {
  createEnumDelimitedArrayParam,
  createEnumParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params'
import { PROJECT_CONFIG } from '@/lib/config/useProjectConfig'
import { PoolsColumnSort } from '@/lib/modules/pool/pool.types'

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

export type PoolTypeKey =
  | GqlPoolFilterType.Weighted
  | GqlPoolFilterType.Stable
  | GqlPoolFilterType.LiquidityBootstrapping
  | GqlPoolFilterType.Gyroe

const poolTypeFilters = Object.keys(POOL_TYPE_MAP) as GqlPoolFilterType[]
const defaultPoolTypes: PoolTypeKey[] = [GqlPoolFilterType.Weighted, GqlPoolFilterType.Stable]

export function usePoolListQueryState() {
  const [query, setQuery] = useQueryParams({
    first: withDefault(NumberParam, 20),
    skip: withDefault(NumberParam, 0),
    orderBy: withDefault(
      createEnumParam(Object.entries(GqlPoolOrderBy).map(([, value]) => value)),
      GqlPoolOrderBy.TotalLiquidity
    ),
    orderDirection: withDefault(
      createEnumParam(Object.entries(GqlPoolOrderDirection).map(([, value]) => value)),
      GqlPoolOrderDirection.Desc
    ),
    poolTypes: withDefault(
      createEnumDelimitedArrayParam([
        GqlPoolFilterType.Weighted,
        GqlPoolFilterType.Stable,
        GqlPoolFilterType.LiquidityBootstrapping,
        GqlPoolFilterType.Gyroe,
      ]),
      defaultPoolTypes
    ),
    networks: withDefault(
      createEnumDelimitedArrayParam(Object.entries(GqlChain).map(([, value]) => value)),
      PROJECT_CONFIG.supportedNetworks
    ),
    textSearch: withDefault(StringParam, null),
  })

  const networks =
    query.networks.length === PROJECT_CONFIG.supportedNetworks.length ? [] : query.networks
  const poolTypes = isEqual(defaultPoolTypes, query.poolTypes) ? [] : query.poolTypes

  // Set internal checked state
  function toggleNetwork(checked: boolean, network: GqlChain) {
    if (checked) {
      setQuery(latest => ({ networks: uniq([...latest.networks, network]) }))
    } else {
      setQuery(latest => ({ networks: latest.networks.filter(chain => chain !== network) }))
    }
  }

  // Set internal checked state
  function togglePoolType(checked: boolean, poolType: PoolTypeKey) {
    if (checked) {
      setQuery(latest => ({ poolTypes: uniq([...(latest.poolTypes || [])]) }))
    } else {
      setQuery(latest => ({
        poolTypes: (latest.poolTypes || []).filter(type => type !== poolType),
      }))
    }
  }

  function setSort(sortingState: PoolsColumnSort[]) {
    if (sortingState.length > 0) {
      setQuery({
        orderBy: sortingState[0].id,
        orderDirection: sortingState[0].desc
          ? GqlPoolOrderDirection.Desc
          : GqlPoolOrderDirection.Asc,
      })
    } else {
      setQuery({
        orderBy: GqlPoolOrderBy.TotalLiquidity,
        orderDirection: GqlPoolOrderDirection.Desc,
      })
    }
  }

  function setPageSize(pageSize: number) {
    setQuery({
      skip: 0,
      first: pageSize,
    })
  }

  function setPageNumber(pageNumber: number) {
    setQuery(latest => ({ skip: pageNumber * latest.first }))
  }

  function setSearch(text: string) {
    setQuery({
      skip: 0,
      textSearch: text,
    })
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
    () => (query.poolTypes || []).map(poolType => POOL_TYPE_MAP[poolType]).flat(),
    [query.poolTypes]
  )

  const totalFilterCount = networks.length + poolTypes.length

  const sorting: PoolsColumnSort[] = query.orderBy
    ? [{ id: query.orderBy, desc: query.orderDirection === GqlPoolOrderDirection.Desc }]
    : []

  const pageNumber = query.skip / query.first
  const pageSize = query.first

  console.log(query.poolTypes, poolTypes)

  return {
    state: query,
    networks,
    toggleNetwork,
    poolTypes,
    poolTypeFilters,
    mappedPoolTypes,
    togglePoolType,
    poolTypeLabel,
    setSort,
    setPageSize,
    setPageNumber,
    setSearch,
    searchText: query.textSearch,
    pageNumber,
    pageSize,
    sorting,
    totalFilterCount,
  }
}
