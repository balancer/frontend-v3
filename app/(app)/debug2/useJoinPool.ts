'use client'

import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { Address, useQuery } from 'wagmi'
import { JoinPayload } from './JoinPayload'

export function useJoinPool(joinPayload: JoinPayload, account?: Address) {
  const joinQuery = useQuery(
    [`useJoinPool:${account}:${joinPayload.queryKey}`],
    async () => {
      return await joinPayload.buildSdkJoinTxConfig(account || noUserAddress)
    },
    {
      enabled: !!account,
    }
  )

  return {
    data: joinQuery.data,
    isLoading: joinQuery.isLoading,
    isError: joinQuery.isError,
    error: joinQuery.error,
  }
}
