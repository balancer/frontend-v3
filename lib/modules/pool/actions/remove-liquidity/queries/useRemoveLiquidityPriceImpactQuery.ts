'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { Address } from 'viem'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'
import { HumanAmount } from '@balancer/sdk'
import { useQuery, UseQueryOptions } from '@tanstack/react-query'

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

  const queryKey = removeLiquidityKeys.priceImpact({
    handler,
    userAddress,
    slippage,
    poolId,
    humanBptIn: humanBptIn,
    tokenOut,
  })

  const queryFn = async () =>
    handler.getPriceImpact({
      humanBptIn: debouncedBptIn,
      tokenOut,
    })

  const queryOpts = {
    enabled: enabled && isConnected && Number(debouncedBptIn) > 0,
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
