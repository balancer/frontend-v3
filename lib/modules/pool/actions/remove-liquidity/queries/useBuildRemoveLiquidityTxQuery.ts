'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useQuery } from 'wagmi'
import { HumanAmountIn } from '../../liquidity-types'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { generateRemoveLiquidityQueryKey } from './generateRemoveLiquidityQueryKey'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildRemoveLiquidityQuery(
  humanAmountsIn: HumanAmountIn[],
  enabled: boolean,
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()

  const { buildTx, lastSdkQueryOutput } = useRemoveLiquidity()
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
      // This method is implemented by an specific handler (instance of RemoveLiquidityHandler)
      return await buildTx(inputs)
    },
    {
      enabled: enabled && isConnected && hasApproval() && !!lastSdkQueryOutput,
    }
  )

  return removeLiquidityQuery
}

function hasApproval() {
  // TODO: Do we need approvals in any scenario
  return true
}
