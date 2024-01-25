'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'
import { HumanAmount } from '@balancer/sdk'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'
import { RemoveLiquiditySimulationQueryResult } from './useRemoveLiquiditySimulationQuery'
import { UseQueryOptions } from '@tanstack/react-query'
import { onlyExplicitRefetch } from '@/lib/shared/utils/queries'

type Props = {
  handler: RemoveLiquidityHandler
  humanBptIn: HumanAmount
  poolId: string
  tokenOut: Address // only required by SingleToken removal
  simulationQuery: RemoveLiquiditySimulationQueryResult
  options?: UseQueryOptions
}

export type RemoveLiquidityBuildQueryResponse = ReturnType<
  typeof useRemoveLiquidityBuildCallDataQuery
>

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useRemoveLiquidityBuildCallDataQuery({
  handler,
  humanBptIn,
  poolId,
  tokenOut, // only required by SingleToken removal
  simulationQuery,
  options = {},
}: Props) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()

  const enabled = options.enabled ?? true

  const queryKey = removeLiquidityKeys.buildCallData({
    handler,
    userAddress,
    slippage,
    poolId,
    humanBptIn,
    tokenOut,
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
    enabled: enabled && isConnected,
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
