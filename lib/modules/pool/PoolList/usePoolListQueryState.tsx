'use client'

import {
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/shared/services/api/generated/graphql'
import { uniq } from 'lodash'
import { PaginationState, SortingState } from '@tanstack/react-table'
import { PROJECT_CONFIG } from '@/lib/config/getProjectConfig'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsStringEnum,
  useQueryState,
} from 'next-usequerystate'

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
  const [first, setFirst] = useQueryState('first', parseAsInteger.withDefault(20))
  const [skip, setSkip] = useQueryState('skip', parseAsInteger.withDefault(0))
  const [orderBy, setOrderBy] = useQueryState(
    'orderBy',
    parseAsStringEnum<GqlPoolOrderBy>(Object.values(GqlPoolOrderBy)) // pass a list of allowed values
      .withDefault(GqlPoolOrderBy.TotalLiquidity)
  )
  const [orderDirection, setOrderDirection] = useQueryState(
    'orderBy',
    parseAsStringEnum<GqlPoolOrderDirection>(Object.values(GqlPoolOrderDirection)) // pass a list of allowed values
      .withDefault(GqlPoolOrderDirection.Desc)
  )
  const [poolTypes, setPoolTypes] = useQueryState(
    'poolTypes',
    parseAsArrayOf(parseAsStringEnum<PoolFilterType>(Object.values(poolTypeFilters))).withDefault(
      []
    )
  )
  const [networks, setNetworks] = useQueryState(
    'networks',
    parseAsArrayOf(parseAsStringEnum<GqlChain>(Object.values(GqlChain))).withDefault([])
  )
  const [textSearch, setTextSearch] = useQueryState('textSearch')

  // Set internal checked state
  function toggleNetwork(checked: boolean, network: GqlChain) {
    if (checked) {
      setNetworks(current => uniq([...current, network]))
    } else {
      setNetworks(current => current.filter(chain => chain !== network))
    }
  }

  // Set internal checked state
  function togglePoolType(checked: boolean, poolType: PoolFilterType) {
    if (checked) {
      setPoolTypes(current => uniq([...current, poolType]))
    } else {
      setPoolTypes(current => current.filter(type => type !== poolType))
    }
  }

  function setSorting(sortingState: SortingState) {
    if (sortingState.length > 0) {
      setSkip(0)
      setOrderBy(sortingState[0].id as GqlPoolOrderBy)
      setOrderDirection(
        sortingState[0].desc ? GqlPoolOrderDirection.Desc : GqlPoolOrderDirection.Asc
      )
    } else {
      setOrderBy(GqlPoolOrderBy.TotalLiquidity)
      setOrderDirection(GqlPoolOrderDirection.Desc)
    }
  }

  function setPagination(pagination: PaginationState) {
    setFirst(pagination.pageSize)
    setSkip(pagination.pageIndex * pagination.pageSize)
  }

  function setSearch(text: string) {
    if (text.length > 0) {
      setSkip(0)
    }

    setTextSearch(text)
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

  const totalFilterCount = networks.length + poolTypes.length
  const sorting: SortingState = orderBy
    ? [{ id: orderBy as string, desc: orderDirection === GqlPoolOrderDirection.Desc }]
    : []

  const pagination: PaginationState = {
    pageIndex: skip / first,
    pageSize: first,
  }

  const mappedPoolTypes = uniq(
    (poolTypes.length > 0 ? poolTypes : Object.keys(POOL_TYPE_MAP))
      .map(poolType => POOL_TYPE_MAP[poolType as keyof typeof POOL_TYPE_MAP])
      .flat()
  )

  const queryVariables = {
    first,
    skip,
    orderBy,
    orderDirection,
    where: {
      poolTypeIn: mappedPoolTypes,
      chainIn: networks.length > 0 ? networks : PROJECT_CONFIG.supportedNetworks,
    },
    textSearch,
  }

  return {
    state: {
      first,
      skip,
      orderBy,
      orderDirection,
      poolTypes,
      networks,
      textSearch,
    },
    toggleNetwork,
    togglePoolType,
    poolTypeLabel,
    setSorting,
    setPagination,
    setSearch,
    searchText: textSearch,
    pagination,
    sorting,
    totalFilterCount,
    poolTypes,
    networks,
    mappedPoolTypes,
    queryVariables,
  }
}
