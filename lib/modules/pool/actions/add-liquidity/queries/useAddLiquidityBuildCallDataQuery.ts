import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useQuery } from '@tanstack/react-query'
import { usePool } from '../../../PoolProvider'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'
import { AddLiquidityParams, addLiquidityKeys } from './add-liquidity-keys'
import { useRelayerSignature } from '@/lib/modules/relayer/RelayerSignatureProvider'
import { sentryMetaForAddLiquidityHandler } from '@/lib/shared/utils/query-errors'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { AddLiquiditySimulationQueryResult } from './useAddLiquiditySimulationQuery'
import { useDebounce } from 'use-debounce'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { useBlockNumber } from 'wagmi'

export type AddLiquidityBuildQueryResponse = ReturnType<typeof useAddLiquidityBuildCallDataQuery>

export type AddLiquidityBuildQueryParams = {
  handler: AddLiquidityHandler
  humanAmountsIn: HumanTokenAmountWithAddress[]
  simulationQuery: AddLiquiditySimulationQueryResult
  slippage: string
}

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useAddLiquidityBuildCallDataQuery({
  handler,
  humanAmountsIn,
  simulationQuery,
  slippage,
  enabled,
}: AddLiquidityBuildQueryParams & {
  enabled: boolean
}) {
  const { userAddress, isConnected } = useUserAccount()
  const { pool, chainId } = usePool()
  const { data: blockNumber } = useBlockNumber({ chainId })
  const { relayerApprovalSignature } = useRelayerSignature()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const params: AddLiquidityParams = {
    handler,
    userAddress,
    slippage,
    poolId: pool.id,
    poolType: pool.type,
    humanAmountsIn: debouncedHumanAmountsIn,
  }

  const queryKey = addLiquidityKeys.buildCallData(params)

  const queryFn = async () => {
    const queryOutput = ensureLastQueryResponse('Add liquidity query', simulationQuery.data)
    const response = await handler.buildCallData({
      account: userAddress,
      humanAmountsIn: debouncedHumanAmountsIn,
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
    enabled: enabled && isConnected && !!simulationQuery.data,
    gcTime: 0,
    meta: sentryMetaForAddLiquidityHandler('Error in add liquidity buildCallData query', {
      ...params,
      chainId,
      blockNumber,
    }),
    ...onlyExplicitRefetch,
  })
}
