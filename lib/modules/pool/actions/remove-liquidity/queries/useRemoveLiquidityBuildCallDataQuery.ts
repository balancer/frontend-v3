'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useRemoveLiquidityBuildCallDataQuery(
  handler: RemoveLiquidityHandler,
  bptIn: bigint,
  isActiveStep: boolean,
  poolId: string,
  tokenOut?: Address
) {
  const { userAddress, isConnected } = useUserAccount()

  const { slippage } = useUserSettings()

  const removeLiquidityQuery = useQuery(
    removeLiquidityKeys.buildCallData({
      userAddress,
      slippage,
      poolId,
      bptIn,
      tokenOut,
    }),
    async () => {
      const inputs = {
        bptIn,
        account: userAddress,
        slippagePercent: slippage,
      }
      return handler.buildRemoveLiquidityTx({ inputs })
    },
    {
      enabled:
        isActiveStep && // If the step is not active (the user did not click Next button) avoid running the build tx query to save RPC requests
        isConnected,
    }
  )

  return removeLiquidityQuery
}
