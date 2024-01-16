'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useQuery } from 'wagmi'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { QueryAddLiquidityOutput, SupportedHandler } from '../add-liquidity.types'
import { addLiquidityKeys } from './add-liquidity-keys'

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useAddLiquidityBuildCallDataQuery(
  handler: SupportedHandler,
  humanAmountsIn: HumanAmountIn[],
  isActiveStep: boolean,
  pool: Pool,
  queryOutput: QueryAddLiquidityOutput
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()

  const { hasAllowances } = useTokenAllowances()

  const addLiquidityQuery = useQuery(
    addLiquidityKeys.buildCallData({
      userAddress,
      slippage,
      poolId: pool.id,
      humanAmountsIn,
    }),
    async () => {
      return handler.buildAddLiquidityCallData({
        humanAmountsIn,
        account: userAddress,
        slippagePercent: slippage,
        queryOutput,
      })
    },
    {
      enabled:
        isActiveStep && // If the step is not active (the user did not click Next button) avoid running the build tx query to save RPC requests
        queryOutput.bptOut && // undefined bptOut means that the preview query did not finish yet
        isConnected &&
        hasAllowances(humanAmountsIn, pool),
    }
  )

  return addLiquidityQuery
}
