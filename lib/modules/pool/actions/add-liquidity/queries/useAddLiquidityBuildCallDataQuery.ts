import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useQuery } from 'wagmi'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'
import { QueryAddLiquidityOutput } from '../add-liquidity.types'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'
import { UseQueryOptions } from '@tanstack/react-query'

interface CountdownControllers {
  startCountdown: () => void
  stopCountdown: () => void
  resetCountdown: () => void
}

type Props = {
  handler: AddLiquidityHandler
  humanAmountsIn: HumanAmountIn[]
  isActiveStep: boolean
  pool: Pool
  queryAddLiquidityOutput?: QueryAddLiquidityOutput
  countdownControllers: CountdownControllers
  options?: UseQueryOptions
}

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useAddLiquidityBuildCallDataQuery({
  handler,
  humanAmountsIn,
  pool,
  queryAddLiquidityOutput,
  countdownControllers,
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
    console.log('Build call data')
    const queryOutput = ensureLastQueryResponse('Add liquidity query', queryAddLiquidityOutput)
    countdownControllers.stopCountdown()
    countdownControllers.resetCountdown()
    const response = await handler.buildAddLiquidityCallData({
      account: userAddress,
      humanAmountsIn,
      slippagePercent: slippage,
      queryOutput,
    })
    countdownControllers.startCountdown()
    return response
  }

  const buildCallDataQuery = useQuery(queryKey, queryFn, {
    enabled: enabled && isConnected,
    cacheTime: 0,
  })

  return { ...buildCallDataQuery, refetchBuildQuery: buildCallDataQuery.refetch }
}
