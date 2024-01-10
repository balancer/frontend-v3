'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { hasValidHumanAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'
import { SupportedHandler } from '../add-liquidity.types'

export function useAddLiquidityPreviewQuery(
  handler: AddLiquidityHandler<SupportedHandler>,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const query = useQuery(
    addLiquidityKeys.priceImpact({
      userAddress,
      slippage,
      poolId,
      humanAmountsIn: debouncedHumanAmountsIn,
    }),
    async () => {
      return await handler.queryAddLiquidity(humanAmountsIn)
    },
    {
      enabled: isConnected && hasValidHumanAmounts(debouncedHumanAmountsIn),
    }
  )

  return {
    isPreviewQueryLoading: query.isLoading,
    queryOutLiquidityOutputs: query.data,
    bptOut: query.data?.bptOut || null, // CHECK WHY CHANGINT TO UNDEFINED BREAKS TESTS
  }
}
