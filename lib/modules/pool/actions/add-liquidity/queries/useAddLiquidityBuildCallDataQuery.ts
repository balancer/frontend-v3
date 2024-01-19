import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useQuery } from 'wagmi'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'
import { UseQueryOptions } from '@tanstack/react-query'
import { AddLiquiditySimulationQueryResult } from './useAddLiquiditySimulationQuery'

type Props = {
  handler: AddLiquidityHandler
  humanAmountsIn: HumanAmountIn[]
  isActiveStep: boolean
  pool: Pool
  simulationQuery: AddLiquiditySimulationQueryResult
  options?: UseQueryOptions
}

export type AddLiquidityBuildQueryResponse = ReturnType<typeof useAddLiquidityBuildCallDataQuery>

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useAddLiquidityBuildCallDataQuery({
  handler,
  humanAmountsIn,
  pool,
  simulationQuery,
  options = {},
}: Props) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()

  const enabled = options.enabled ?? true

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
    console.log('Building call data...')
    const queryOutput = ensureLastQueryResponse('Add liquidity query', simulationQuery.data)
    const response = await handler.buildAddLiquidityCallData({
      account: userAddress,
      humanAmountsIn,
      slippagePercent: slippage,
      queryOutput: queryOutput,
    })
    console.log('Call data built:', response)
    return response
  }

  const queryOpts = {
    enabled: enabled && isConnected,
    cacheTime: 0,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
