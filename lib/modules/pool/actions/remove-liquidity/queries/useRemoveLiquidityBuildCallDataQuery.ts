'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useQuery } from '@tanstack/react-query'
import { removeLiquidityKeys } from './remove-liquidity-keys'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'
import { onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { usePool } from '../../../usePool'
import { useRemoveLiquidity } from '../useRemoveLiquidity'

export type RemoveLiquidityBuildQueryResponse = ReturnType<
  typeof useRemoveLiquidityBuildCallDataQuery
>

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useRemoveLiquidityBuildCallDataQuery() {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const { pool } = usePool()
  const { humanBptIn, handler, simulationQuery, singleTokenOutAddress } = useRemoveLiquidity()

  const queryKey = removeLiquidityKeys.buildCallData({
    handler,
    userAddress,
    slippage,
    poolId: pool.id,
    humanBptIn,
    tokenOut: singleTokenOutAddress, // only required by SingleToken removal
  })

  const queryFn = async () => {
    const queryOutput = ensureLastQueryResponse('Remove liquidity query', simulationQuery.data)
    const res = await handler.buildCallData({
      account: userAddress,
      slippagePercent: slippage,
      queryOutput,
    })
    console.log('Call data built:', res)
    return res
  }

  const queryOpts = {
    enabled: isConnected && !!simulationQuery.data,
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
