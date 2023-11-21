'use client'

import { noUserAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Address, useQuery } from 'wagmi'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useAddLiquidityPoolConfig(
  addLiquidityConfigBuilder: AddLiquidityConfigBuilder,
  account?: Address
) {
  const addLiquidityQuery = useQuery(
    [`useJoinPool:${account}:${addLiquidityConfigBuilder.queryKey}`],
    async () => {
      return await addLiquidityConfigBuilder.buildSdkAddLiquidityTxConfig(account || noUserAddress)
    },
    {
      enabled: !!account,
    }
  )

  return addLiquidityQuery
}
