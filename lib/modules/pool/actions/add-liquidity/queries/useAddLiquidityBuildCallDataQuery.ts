import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useQuery } from 'wagmi'
import { usePool } from '../../../usePool'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'
import { useAddLiquidity } from '../useAddLiquidity'
import { addLiquidityKeys } from './add-liquidity-keys'

export type AddLiquidityBuildQueryResponse = ReturnType<typeof useAddLiquidityBuildCallDataQuery>

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useAddLiquidityBuildCallDataQuery() {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const { pool } = usePool()

  const { humanAmountsIn, handler, simulationQuery, relayerApprovalSignature } = useAddLiquidity()

  const queryKey = addLiquidityKeys.buildCallData({
    userAddress,
    slippage,
    poolId: pool.id,
    humanAmountsIn,
  })

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

  const queryOpts = {
    enabled: isConnected && !!simulationQuery.data,
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
