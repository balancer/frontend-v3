'use client'

import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { UseQueryOptions } from '@tanstack/react-query'
import { SwapHandler, SwapInputs } from '../handlers/Swap.handler'
import { swapQueryKeys } from './swapQueryKeys'

type Params = {
  handler: SwapHandler
  swapInputs: SwapInputs
  options?: UseQueryOptions
}

export function useSwapSimulationQuery({
  handler,
  swapInputs: { swapAmount, chain, tokenIn, tokenOut, swapType },
  options = {},
}: Params) {
  const debouncedSwapAmount = useDebounce(swapAmount, defaultDebounceMs)[0]

  const enabled = options.enabled ?? true

  const queryKey = swapQueryKeys.simulation({
    swapAmount: debouncedSwapAmount,
    swapType,
    tokenIn,
    tokenOut,
    chain,
  })

  const queryFn = async () =>
    handler.simulate({ swapAmount: debouncedSwapAmount, swapType, tokenIn, tokenOut, chain })

  const queryOpts = {
    enabled,
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
