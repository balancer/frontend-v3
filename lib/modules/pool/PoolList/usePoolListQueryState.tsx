'use client'

import {
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/shared/services/api/generated/graphql'
import { uniq } from 'lodash'
import {
  createEnumDelimitedArrayParam,
  createEnumParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'

export const poolTypeFilters = [
  GqlPoolFilterType.Weighted,
  GqlPoolFilterType.Stable,
  GqlPoolFilterType.LiquidityBootstrapping,
  GqlPoolFilterType.Gyro,
] as const

export type PoolFilterType = (typeof poolTypeFilters)[number]

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
    poolTypes: withDefault(createEnumDelimitedArrayParam([...poolTypeFilters], ','), []),
    networks: withDefault(
      createEnumDelimitedArrayParam(
        Object.entries(GqlChain).map(([, value]) => value),
        ','
      ),
      []
    ),
    textSearch: withDefault(StringParam, null),
  })

  // Set internal checked state
  function toggleNetwork(checked: boolean, network: GqlChain) {
    if (checked) {
      setQuery(latest => ({ networks: uniq([...latest.networks, network]) }))
    } else {
      setQuery(latest => ({ networks: latest.networks.filter(chain => chain !== network) }))
    }
  }

  // Set internal checked state
  function togglePoolType(checked: boolean, poolType: PoolFilterType) {
    if (checked) {
      setQuery(latest => ({ poolTypes: uniq([...latest.poolTypes, poolType]) }))
    } else {
      setQuery(latest => ({
        poolTypes: (latest.poolTypes || []).filter(type => type !== poolType),
      }))
    }
  }

  function setSorting(sortingState: SortingState) {
    if (sortingState.length > 0) {
      setQuery({
        skip: 0, // always sort from top (or bottom)
        orderBy: sortingState[0].id as GqlPoolOrderBy,
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

  function setPagination(pagination: PaginationState) {
    setQuery({
      first: pagination.pageSize,
      skip: pagination.pageIndex * pagination.pageSize,
    })
  }

  function setSearch(text: string) {
    setQuery(latest => ({ skip: text.length > 0 ? 0 : latest.skip, textSearch: text }))
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

  const totalFilterCount = query.networks.length + query.poolTypes.length
  const sorting: SortingState = query.orderBy
    ? [{ id: query.orderBy as string, desc: query.orderDirection === GqlPoolOrderDirection.Desc }]
    : []

  const pagination: PaginationState = {
    pageIndex: query.skip / query.first,
    pageSize: query.first,
  }

  const mappedPoolTypes = uniq(
    (query.poolTypes.length > 0 ? query.poolTypes : Object.keys(POOL_TYPE_MAP))
      .map(poolType => POOL_TYPE_MAP[poolType as keyof typeof POOL_TYPE_MAP])
      .flat()
  )

  const queryVariables = {
    first: query.first,
    skip: query.skip,
    orderBy: query.orderBy,
    orderDirection: query.orderDirection,
    where: {
      poolTypeIn: mappedPoolTypes,
      chainIn: query.networks.length > 0 ? query.networks : PROJECT_CONFIG.supportedNetworks,
    },
    textSearch: query.textSearch,
  }

  return {
    state: query,
    toggleNetwork,
    togglePoolType,
    poolTypeLabel,
    setSorting,
    setPagination,
    setSearch,
    searchText: query.textSearch,
    pagination,
    sorting,
    totalFilterCount,
    poolTypes: query.poolTypes,
    networks: query.networks,
    mappedPoolTypes,
    queryVariables,
  }
}
