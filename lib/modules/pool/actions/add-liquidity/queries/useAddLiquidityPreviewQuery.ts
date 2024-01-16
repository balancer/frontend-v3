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

export type AddLiquidityPreviewQueryResult = ReturnType<typeof useAddLiquidityPreviewQuery>

export function useAddLiquidityPreviewQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const query = useQuery(
    addLiquidityKeys.preview({
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
      cacheTime: 0,
    }
  )

  return {
    ...query,
    bptOut: query.data?.bptOut,
    isPreviewQueryLoading: query.isLoading,
    isPreviewQueryRefetching: query.isRefetching,
    refetchPreviewQuery: query.refetch,
  }
}
