'use client'

import {
  GqlChain,
  GqlPoolType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/shared/services/api/generated/graphql'
import { uniq } from 'lodash'
import { useQueryState } from 'next-usequerystate'
import {
  POOL_TYPE_MAP,
  PoolFilterType,
  poolListQueryStateParsers,
  SortingState,
} from '../pool.types'
import { PaginationState } from '@/lib/shared/components/pagination/pagination.types'
import { supportedNetworks } from '../../web3/Web3Provider'

export function usePoolListQueryState() {
  const [first, setFirst] = useQueryState('first', poolListQueryStateParsers.first)
  const [skip, setSkip] = useQueryState('skip', poolListQueryStateParsers.skip)
  const [orderBy, setOrderBy] = useQueryState('orderBy', poolListQueryStateParsers.orderBy)
  const [orderDirection, setOrderDirection] = useQueryState(
    'orderDirection',
    poolListQueryStateParsers.orderDirection
  )
  const [poolTypes, setPoolTypes] = useQueryState('poolTypes', poolListQueryStateParsers.poolTypes)
  const [networks, setNetworks] = useQueryState('networks', poolListQueryStateParsers.networks)
  const [textSearch, setTextSearch] = useQueryState(
    'textSearch',
    poolListQueryStateParsers.textSearch
  )
  const [userAddress, setUserAddress] = useQueryState(
    'userAddress',
    poolListQueryStateParsers.userAddress
  )

  // Set internal checked state
  function toggleUserAddress(checked: boolean, address: string) {
    if (checked) {
      setUserAddress(address)
    } else {
      setUserAddress('')
    }
  }

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
      setOrderBy(sortingState[0].id)
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

  function poolTypeLabel(poolType: GqlPoolType) {
    switch (poolType) {
      case GqlPoolType.Weighted:
        return 'Weighted'
      case GqlPoolType.Stable:
        return 'Stable'
      case GqlPoolType.LiquidityBootstrapping:
        return 'Liquidity Bootstrapping'
      case GqlPoolType.Gyro:
        return 'CLP'
      default:
        return poolType.toLowerCase()
    }
  }

  const totalFilterCount = networks.length + poolTypes.length + (userAddress ? 1 : 0)
  const sorting: SortingState = orderBy
    ? [{ id: orderBy, desc: orderDirection === GqlPoolOrderDirection.Desc }]
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
      chainIn: networks.length > 0 ? networks : supportedNetworks,
      userAddress,
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
    toggleUserAddress,
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
    userAddress,
  }
}
