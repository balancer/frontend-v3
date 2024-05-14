'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useQuery } from '@tanstack/react-query'
import { RemoveLiquidityParams, removeLiquidityKeys } from './remove-liquidity-keys'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { usePool } from '../../../usePool'
import { useRelayerSignature } from '@/lib/modules/relayer/useRelayerSignature'
import { sentryMetaForRemoveLiquidityHandler } from '@/lib/shared/utils/query-errors'
import { HumanAmount } from '@balancer/sdk'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { Address } from 'viem/accounts'
import { RemoveLiquiditySimulationQueryResult } from './useRemoveLiquiditySimulationQuery'
import { useDebounce } from 'use-debounce'

export type RemoveLiquidityBuildQueryResponse = ReturnType<
  typeof useRemoveLiquidityBuildCallDataQuery
>

export type RemoveLiquidityBuildQueryParams = {
  humanBptIn: HumanAmount
  handler: RemoveLiquidityHandler
  simulationQuery: RemoveLiquiditySimulationQueryResult
  singleTokenOutAddress: Address
  wethIsEth: boolean
} & {
  enabled?: boolean
}

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useRemoveLiquidityBuildCallDataQuery({
  humanBptIn,
  handler,
  simulationQuery,
  singleTokenOutAddress,
  wethIsEth,
  enabled = true,
}: RemoveLiquidityBuildQueryParams) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const { pool } = usePool()
  const { relayerApprovalSignature } = useRelayerSignature()
  const debouncedHumanBptIn = useDebounce(humanBptIn, defaultDebounceMs)[0]

  const params: RemoveLiquidityParams = {
    handler,
    userAddress,
    slippage,
    poolId: pool.id,
    humanBptIn: debouncedHumanBptIn,
    tokenOut: singleTokenOutAddress, // only required by SingleToken removal
    wethIsEth, // only required by SingleToken removal
  }

  const queryKey = removeLiquidityKeys.buildCallData(params)

  const queryFn = async () => {
    const queryOutput = ensureLastQueryResponse('Remove liquidity query', simulationQuery.data)
    const res = await handler.buildCallData({
      account: userAddress,
      slippagePercent: slippage,
      queryOutput,
      relayerApprovalSignature,
      wethIsEth,
    })

    console.log('Call data built:', res)
    return res
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled: enabled && isConnected && !!simulationQuery.data,
    gcTime: 0,
    meta: sentryMetaForRemoveLiquidityHandler(
      'Error in remove liquidity buildCallData query',
      params
    ),
    ...onlyExplicitRefetch,
  })
}
