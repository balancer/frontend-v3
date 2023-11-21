'use client'

import { noUserAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Address, useQuery } from 'wagmi'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useJoinPoolConfig(joinConfigBuilder: AddLiquidityConfigBuilder, account?: Address) {
  const joinQuery = useQuery(
    [`useJoinPool:${account}:${joinConfigBuilder.queryKey}`],
    async () => {
      return await joinConfigBuilder.buildSdkAddLiquidityTxConfig(account || noUserAddress)
    },
    {
      enabled: !!account,
    }
  )

  return joinQuery
}
