import { GqlPoolOrderBy, GqlPoolOrderDirection } from '@/lib/services/api/generated/graphql'
import { SortingState } from '@tanstack/react-table'
import { useEffect, useState } from 'react'

export const DEFAULT_ORDER_BY = GqlPoolOrderBy.TotalLiquidity
export const DEFAULT_ORDER_DIRECTION = GqlPoolOrderDirection.Desc

export function usePoolSorting() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [orderBy, setOrderBy] = useState<GqlPoolOrderBy>(DEFAULT_ORDER_BY)
  const [orderDirection, setOrderDirection] =
    useState<GqlPoolOrderDirection>(DEFAULT_ORDER_DIRECTION)

  useEffect(() => {
    switch (sorting[0]?.id) {
      case 'totalLiquidity':
        setOrderBy(GqlPoolOrderBy.TotalLiquidity)
        break
      case 'volume24h':
        setOrderBy(GqlPoolOrderBy.Volume24h)
        break
      case 'apr':
        setOrderBy(GqlPoolOrderBy.Apr)
        break
      default:
        setOrderBy(DEFAULT_ORDER_BY)
    }

    if (!sorting[0]) {
      setOrderDirection(DEFAULT_ORDER_DIRECTION)
    } else {
      setOrderDirection(sorting[0]?.desc ? GqlPoolOrderDirection.Desc : GqlPoolOrderDirection.Asc)
    }
  }, [sorting])

  return {
    sorting,
    setSorting,
    orderBy,
    orderDirection,
  }
}
