'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'
import { HumanAmount } from '@balancer/sdk'
import { useDebounce } from 'use-debounce'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'

export type RemoveLiquidityPreviewQueryResult = ReturnType<typeof useRemoveLiquidityPreviewQuery>

export function useRemoveLiquidityPreviewQuery(
  handler: RemoveLiquidityHandler,
  poolId: string,
  humanBptIn: HumanAmount,
  tokenOut: Address
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedHumanBptIn = useDebounce(humanBptIn, defaultDebounceMs)[0]

  const query = useQuery(
    removeLiquidityKeys.preview({
      handler,
      userAddress,
      slippage,
      poolId,
      humanBptIn: debouncedHumanBptIn,
      tokenOut,
    }),
    async () => {
      return await handler.queryRemoveLiquidity({
        humanBptIn: debouncedHumanBptIn,
        tokenOut,
      })
    },
    {
      enabled: isConnected && Number(debouncedHumanBptIn) > 0,
      cacheTime: 0,
    }
  )

  return {
    ...query,
    amountsOut: query.data?.amountsOut,
    isPreviewQueryLoading: query.isLoading,
    isPreviewQueryRefetching: query.isRefetching,
    refetchPreviewQuery: query.refetch,
  }
}
