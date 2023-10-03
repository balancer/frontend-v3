'use client'

import {
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { uniq } from 'lodash'
import {
  createEnumDelimitedArrayParam,
  createEnumParam,
  NumberParam,
  StringParam,
  useQueryParams,
  withDefault,
} from 'use-query-params'
import { PoolsColumnSort } from '@/lib/modules/pool/pool.types'

export const poolTypeFilters = [
  GqlPoolFilterType.Weighted,
  GqlPoolFilterType.Stable,
  GqlPoolFilterType.LiquidityBootstrapping,
  GqlPoolFilterType.Gyro,
] as const
export type PoolFilterType = (typeof poolTypeFilters)[number]

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
      createEnumDelimitedArrayParam(
        [
          GqlPoolFilterType.Weighted,
          GqlPoolFilterType.Stable,
          GqlPoolFilterType.LiquidityBootstrapping,
          GqlPoolFilterType.Gyro,
        ],
        ','
      ),
      []
    ),
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

  const totalFilterCount = query.networks.length + query.poolTypes.length
  const sorting: PoolsColumnSort[] = query.orderBy
    ? [{ id: query.orderBy, desc: query.orderDirection === GqlPoolOrderDirection.Desc }]
    : []

  const pageNumber = query.skip / query.first
  const pageSize = query.first

  return {
    state: query,
    toggleNetwork,
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
    poolTypes: query.poolTypes,
    networks: query.networks,
  }
}
