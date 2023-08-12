import { GqlPoolOrderBy, GqlPoolOrderDirection } from '@/lib/services/api/generated/graphql'
import { SortingState } from '@tanstack/react-table'
import { useEffect, useMemo, useState } from 'react'

export const DEFAULT_ORDER_BY = GqlPoolOrderBy.TotalLiquidity
export const DEFAULT_ORDER_DIRECTION = GqlPoolOrderDirection.Desc

export function usePoolSorting() {
  const [sorting, setSorting] = useState<SortingState>([])

  useEffect(() => {
    console.log('sorting', sorting)
  }, [sorting])

  const orderBy = useMemo(() => {
    switch (sorting[0]?.id) {
      case 'totalLiquidity':
        return GqlPoolOrderBy.TotalLiquidity
      case 'volume24h':
        return GqlPoolOrderBy.Volume24h
      case 'apr':
        return GqlPoolOrderBy.Apr
      default:
        return DEFAULT_ORDER_BY
    }
  }, [sorting])

  const orderDirection = useMemo(() => {
    if (!sorting[0]) return DEFAULT_ORDER_DIRECTION

    return sorting[0]?.desc ? GqlPoolOrderDirection.Desc : GqlPoolOrderDirection.Asc
  }, [sorting])

  return {
    sorting,
    setSorting,
    orderBy,
    orderDirection,
  }
}
