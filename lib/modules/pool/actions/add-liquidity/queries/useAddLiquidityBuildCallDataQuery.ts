import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useQuery } from '@tanstack/react-query'
import { usePool } from '../../../usePool'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'
import { AddLiquidityParams, addLiquidityKeys } from './add-liquidity-keys'
import { useRelayerSignature } from '@/lib/modules/relayer/useRelayerSignature'
import { sentryMetaForAddLiquidityHandler } from '@/lib/shared/utils/query-errors'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquiditySimulationQueryResult } from './useAddLiquiditySimulationQuery'

export type AddLiquidityBuildQueryResponse = ReturnType<typeof useAddLiquidityBuildCallDataQuery>

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useAddLiquidityBuildCallDataQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  simulationQuery: AddLiquiditySimulationQueryResult
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const { pool } = usePool()

  // const { humanAmountsIn, handler, simulationQuery } = useAddLiquidity()
  const { relayerApprovalSignature } = useRelayerSignature()

  const params: AddLiquidityParams = {
    handler,
    userAddress,
    slippage,
    poolId: pool.id,
    poolType: pool.type,
    humanAmountsIn,
  }

  const queryKey = addLiquidityKeys.buildCallData(params)

  const queryFn = async () => {
    const queryOutput = ensureLastQueryResponse('Add liquidity query', simulationQuery.data)
    const response = await handler.buildCallData({
      account: userAddress,
      humanAmountsIn,
      slippagePercent: slippage,
      queryOutput,
      relayerApprovalSignature, // only present in Add Nested Liquidity with sign relayer mode
    })
    console.log('Call data built:', response)
    return response
  }

  return useQuery({
    queryKey,
    queryFn,
    enabled: isConnected && !!simulationQuery.data,
    gcTime: 0,
    meta: sentryMetaForAddLiquidityHandler('Error in add liquidity buildCallData query', params),
    ...onlyExplicitRefetch,
  })
}
