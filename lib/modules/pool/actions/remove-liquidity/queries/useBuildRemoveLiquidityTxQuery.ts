'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useQuery } from 'wagmi'
import { HumanAmountIn } from '../../liquidity-types'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { generateRemoveLiquidityQueryKey } from './generateRemoveLiquidityQueryKey'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildRemoveLiquidityQuery(
  handler: RemoveLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  isActiveStep: boolean,
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()

  const { slippage } = useUserSettings()

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      queryId: 'BuildTxConfig',
      userAddress,
      poolId,
      slippage,
      humanAmountsIn,
    })
  }

  const removeLiquidityQuery = useQuery(
    [queryKey()],
    async () => {
      const inputs = {
        humanAmountsIn,
        account: userAddress,
        slippagePercent: slippage,
      }
      return handler.buildRemoveLiquidityTx({ inputs })
    },
    {
      enabled:
        isActiveStep && // If the step is not active (the user did not click Next button) avoid running the build tx query to save RPC requests
        isConnected &&
        hasApproval(),
    }
  )

  return removeLiquidityQuery
}

function hasApproval() {
  // TODO: Do we need approvals in any scenario
  return true
}
