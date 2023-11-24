'use client'

import { MockApi } from '@/lib/shared/hooks/balancer-api/MockApi'
import { Address, useQuery } from 'wagmi'

const POOL_STATE_CACHE__TIME_MS = 30_000

export type PoolStateInputResult = ReturnType<typeof usePoolStateInput>

export function usePoolStateInput(poolId: Address) {
  return useQuery(
    [`usePoolState:${poolId}`],
    async () => {
      return fetchPoolState(poolId)
    },
    { cacheTime: POOL_STATE_CACHE__TIME_MS }
  )
}

async function fetchPoolState(poolId: Address) {
  // get pool state from api
  const api = new MockApi()
  // NOTE: pool state should be ready when using this flow in the pool page
  return await api.getPool(poolId)
}
