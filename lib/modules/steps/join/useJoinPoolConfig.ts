'use client'

import { noUserAddress } from '@/lib/contracts/wagmi-helpers'
import { Address, useQuery } from 'wagmi'
import { JoinConfigBuilder } from './JoinConfigBuilder'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useJoinPoolConfig(joinConfigBuilder: JoinConfigBuilder, account?: Address) {
  const joinQuery = useQuery(
    [`useJoinPool:${account}:${joinConfigBuilder.queryKey}`],
    async () => {
      return await joinConfigBuilder.buildSdkJoinTxConfig(account || noUserAddress)
    },
    {
      enabled: !!account,
    }
  )

  return joinQuery
}
