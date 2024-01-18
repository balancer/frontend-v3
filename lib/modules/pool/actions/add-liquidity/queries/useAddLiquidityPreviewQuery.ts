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
import { UseQueryOptions } from '@tanstack/react-query'

export type AddLiquidityPreviewQueryResult = ReturnType<typeof useAddLiquidityPreviewQuery>

export function useAddLiquidityPreviewQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string,
  options: UseQueryOptions = {}
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const enabled = options.enabled ?? true

  const query = useQuery(
    addLiquidityKeys.preview({
      userAddress,
      slippage,
      poolId,
      humanAmountsIn: debouncedHumanAmountsIn,
    }),
    async () => handler.queryAddLiquidity(humanAmountsIn),
    {
      enabled: enabled && isConnected && hasValidHumanAmounts(debouncedHumanAmountsIn),
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
