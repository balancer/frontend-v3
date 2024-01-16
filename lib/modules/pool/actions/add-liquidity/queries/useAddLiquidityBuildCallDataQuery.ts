import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useQuery } from 'wagmi'
import { Pool } from '../../../usePool'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'
import { QueryAddLiquidityOutput } from '../add-liquidity.types'
import { ensureLastQueryResponse } from '../../LiquidityActionHelpers'

type Props = {
  handler: AddLiquidityHandler
  humanAmountsIn: HumanAmountIn[]
  isActiveStep: boolean
  pool: Pool
  startRefetchCountdown: () => void
  queryAddLiquidityOutput?: QueryAddLiquidityOutput
}

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useAddLiquidityBuildCallDataQuery({
  handler,
  humanAmountsIn,
  isActiveStep,
  pool,
  startRefetchCountdown,
  queryAddLiquidityOutput,
}: Props) {
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
      // There is a very unlikely case when the user activates the step just when the preview query is loading
      const queryOutput = ensureLastQueryResponse('Add liquidity query', queryAddLiquidityOutput)
      startRefetchCountdown()
      return handler.buildAddLiquidityCallData({
        account: userAddress,
        humanAmountsIn,
        slippagePercent: slippage,
        queryOutput,
      })
    },
    {
      enabled:
        // If the step is not active (the user did not click Next button) or a preview query is currently running we avoid running the build tx query to save RPC requests
        isActiveStep && isConnected && hasAllowances(humanAmountsIn, pool),

      cacheTime: 0,
    }
  )

  return { ...addLiquidityQuery, refetchBuildQuery: addLiquidityQuery.refetch }
}
