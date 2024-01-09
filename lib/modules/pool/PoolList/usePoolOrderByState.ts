import { GqlPoolOrderBy } from '@/lib/shared/services/api/generated/graphql'
import { useState, useEffect } from 'react'
import { usePoolListQueryState } from './usePoolListQueryState'

export function usePoolOrderByState() {
  const { sorting, setSorting, userAddress } = usePoolListQueryState()
  const [orderBy, setOrderBy] = useState([
    GqlPoolOrderBy.TotalLiquidity,
    GqlPoolOrderBy.Volume24h,
    GqlPoolOrderBy.Apr,
  ])

  useEffect(() => {
    if (userAddress) {
      setOrderBy([GqlPoolOrderBy.UserbalanceUsd, ...orderBy])
      setSorting([{ id: GqlPoolOrderBy.UserbalanceUsd, desc: true }])
    } else {
      setOrderBy(orderBy.filter(item => item !== GqlPoolOrderBy.UserbalanceUsd))
      if (sorting[0].id === GqlPoolOrderBy.UserbalanceUsd) {
        setSorting([{ id: GqlPoolOrderBy.TotalLiquidity, desc: true }])
      }
    }
  }, [userAddress])

  return {
    orderBy,
  }
}
