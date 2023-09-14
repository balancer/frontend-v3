import {
  GqlChain,
  GqlPoolFilterType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/services/api/generated/graphql'
import { PoolsQueryVariables } from '../pool.types'
import { PROJECT_CONFIG } from '@/lib/config/useProjectConfig'
import { useEffect } from 'react'
import { POOL_TYPE_MAP } from './usePoolListFilters'

export const DEFAULT_POOL_LIST_QUERY_VARS: PoolsQueryVariables = {
  first: 20,
  skip: 0,
  orderBy: GqlPoolOrderBy.TotalLiquidity,
  orderDirection: GqlPoolOrderDirection.Desc,
  where: {
    poolTypeIn: [
      GqlPoolFilterType.Weighted,
      GqlPoolFilterType.Stable,
      GqlPoolFilterType.PhantomStable,
      GqlPoolFilterType.MetaStable,
      GqlPoolFilterType.Gyro,
      GqlPoolFilterType.Gyro3,
      GqlPoolFilterType.Gyroe,
    ],
    chainIn: PROJECT_CONFIG.supportedNetworks, //[GqlChain.Base]
  },
  textSearch: null,
}

function mutateParam(
  params: URLSearchParams,
  key: string,
  value: string,
  shouldSet: boolean = value.length > 0
) {
  if (shouldSet) params.set(key, value)
  else params.delete(key)
}

type QueryVarToUrlParam = {
  key: string
  value: string
  shouldSet?: () => boolean
}

function updateURLParams(vars: QueryVarToUrlParam[]) {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)

  vars.forEach(({ key, value, shouldSet }) => {
    mutateParam(params, key, value, shouldSet ? shouldSet() : undefined)
  })

  const searchParams = params.size > 0 ? `?${params.toString()}` : ''
  window.history.pushState({}, '', `${url.pathname}${searchParams}`)
}

export function useQueryVarsWatcher(vars: QueryVarToUrlParam[]) {
  return useEffect(() => {
    console.log('useQueryVarsWatcher', vars)
    updateURLParams(vars)
  }, [vars])
}

export function getInitQueryVariables(): PoolsQueryVariables {
  const url = new URL(window.location.href)
  const params = new URLSearchParams(url.search)
  const networks = params.get('networks')
  const poolTypes = params.get('poolTypes')
  const searchText = params.get('search')
  const pageNumber = params.get('pageNumber')
  const pageSize = params.get('pageSize')

  let variables = DEFAULT_POOL_LIST_QUERY_VARS

  function setNewVars(vars: PoolsQueryVariables, newVars: Partial<PoolsQueryVariables>) {
    return {
      ...vars,
      ...newVars,
      where: {
        ...vars.where,
        ...newVars.where,
      },
    }
  }

  if (networks) {
    variables = setNewVars(variables, {
      where: {
        chainIn: networks.split(',') as GqlChain[],
      },
    })
  }

  if (poolTypes) {
    const _poolTypes = poolTypes
      .split(',')
      .map(poolType => POOL_TYPE_MAP[poolType])
      .flat()

    variables = setNewVars(variables, {
      where: {
        poolTypeIn: _poolTypes,
      },
    })
  }

  if (searchText) {
    variables = setNewVars(variables, {
      textSearch: searchText,
    })
  }

  if (pageNumber) {
    variables = setNewVars(variables, {
      skip: parseInt(pageNumber) * variables.first,
    })
  }

  if (pageSize) {
    variables = setNewVars(variables, {
      first: parseInt(pageSize),
    })
  }

  return variables
}
