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

export type AddLiquidityPreviewQueryResult = ReturnType<typeof useAddLiquidityMixedQuery>

export function useAddLiquidityMixedQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string,
  isBuildCallReady: boolean,
  startRefetchCountdown: () => void
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const query = useQuery(
    addLiquidityKeys.mixed({
      userAddress,
      slippage,
      poolId,
      humanAmountsIn: debouncedHumanAmountsIn,
      isBuildCallReady,
    }),
    async () => {
      if (isBuildCallReady) startRefetchCountdown()

      return await handler.mixed(humanAmountsIn, userAddress, slippage, isBuildCallReady)
    },
    {
      // enabled: isConnected && hasValidHumanAmounts(debouncedHumanAmountsIn),
      enabled: hasValidHumanAmounts(debouncedHumanAmountsIn),
      cacheTime: 0,
    }
  )

  return {
    bptOut: query.data?.bptOut,
    isMixedQueryLoading: query.isLoading,
    refetchMixedQuery: query.refetch,
    transactionConfig: query.data?.transactionConfig,
    mixedQueryError: query.error,
  }
}
