'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'
import { HumanAmount } from '@balancer/sdk'
import { QueryRemoveLiquidityOutput } from '../remove-liquidity.types'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'

type Props = {
  handler: RemoveLiquidityHandler
  humanBptIn: HumanAmount
  isActiveStep: boolean
  poolId: string
  tokenOut?: Address // only required by SingleTokenRemoval
  queryRemoveLiquidityOutput?: QueryRemoveLiquidityOutput
}

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useRemoveLiquidityBuildCallDataQuery({
  handler,
  humanBptIn,
  isActiveStep,
  poolId,
  tokenOut, // only required by SingleTokenRemoval
  queryRemoveLiquidityOutput,
}: Props) {
  const { userAddress, isConnected } = useUserAccount()

  const { slippage } = useUserSettings()

  const removeLiquidityQuery = useQuery(
    removeLiquidityKeys.buildCallData({
      handler,
      userAddress,
      slippage,
      poolId,
      humanBptIn,
      tokenOut,
    }),

    async () => {
      /*
        This should never happen as:
          1. We do not allow the user to activate the build step (set isActiveStep to true) before the preview query has finished
          2. When we refetch after countdown timeout we explicitly wait for the preview query to finish
      */
      const queryOutput = ensureLastQueryResponse(
        'Remove liquidity query',
        queryRemoveLiquidityOutput
      )
      return handler.buildRemoveLiquidityCallData({
        account: userAddress,
        slippagePercent: slippage,
        queryOutput,
      })
    },
    {
      enabled:
        isActiveStep && // If the step is not active (the user did not click Next button) avoid running the build tx query to save RPC requests
        isConnected,
    }
  )

  return { ...removeLiquidityQuery, refetchBuildQuery: removeLiquidityQuery.refetch }
}
