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
export function useAddLiquidityBuildCallDataQuery({ enabled }: { enabled: boolean }) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const { pool } = usePool()

  const { humanAmountsIn, handler, simulationQuery } = useAddLiquidity()

  const queryKey = addLiquidityKeys.buildCallData({
    userAddress,
    slippage,
    poolId: pool.id,
    humanAmountsIn,
  })

  const queryFn = async () => {
    /*
        This should never happen as:
          1. We do not allow the user to activate the build step (set isActiveStep to true) before the preview query has finished
          2. When we refetch after countdown timeout we explicitly wait for the preview query to finish
      */
    const queryOutput = ensureLastQueryResponse('Add liquidity query', simulationQuery.data)
    const response = await handler.buildCallData({
      account: userAddress,
      humanAmountsIn,
      slippagePercent: slippage,
      queryOutput: queryOutput,
    })
    console.log('Call data built:', response)
    return response
  }

  const queryOpts = {
    enabled: enabled && isConnected && !!simulationQuery.data,
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
