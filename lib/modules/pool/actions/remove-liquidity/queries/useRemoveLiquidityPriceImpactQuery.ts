'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { Address } from 'viem'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { RemoveLiquidityParams, removeLiquidityKeys } from './remove-liquidity-keys'
import { HumanAmount } from '@balancer/sdk'
import { useQuery } from 'wagmi'
import { UseQueryOptions } from '@tanstack/react-query'
import { captureRemoveLiquidityHandlerError } from '@/lib/shared/utils/query-errors'

export function useRemoveLiquidityPriceImpactQuery(
  handler: RemoveLiquidityHandler,
  poolId: string,
  humanBptIn: HumanAmount,
  tokenOut: Address,
  options: UseQueryOptions = {}
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedBptIn = useDebounce(humanBptIn, defaultDebounceMs)[0]

  const enabled = options.enabled ?? true

  const params: RemoveLiquidityParams = {
    handler,
    userAddress,
    slippage,
    poolId,
    humanBptIn: humanBptIn,
    tokenOut,
  }

  const queryKey = removeLiquidityKeys.priceImpact(params)

  const queryFn = async () =>
    handler.getPriceImpact({
      humanBptIn: debouncedBptIn,
      tokenOut,
    })

  return useQuery(queryKey, queryFn, {
    enabled: enabled && isConnected && Number(debouncedBptIn) > 0,
    cacheTime: 0,
    ...onlyExplicitRefetch,
    onError(error: unknown) {
      captureRemoveLiquidityHandlerError(
        error,
        'Error in remove liquidity price impact query',
        params
      )
    },
  })
}
