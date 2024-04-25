'use client'

import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { UseQueryOptions } from '@tanstack/react-query'
import { SwapHandler } from '../handlers/Swap.handler'
import { swapQueryKeys } from './swapQueryKeys'
import { SimulateSwapInputs, SimulateSwapResponse } from '../swap.types'
import { captureSwapHandlerError } from '@/lib/shared/utils/query-errors'

export type SimulateSwapParams = {
  handler: SwapHandler
  swapInputs: SimulateSwapInputs
  options?: UseQueryOptions
}

export function useSimulateSwapQuery({
  handler,
  swapInputs: { swapAmount, chain, tokenIn, tokenOut, swapType },
  options = {},
}: SimulateSwapParams) {
  const debouncedSwapAmount = useDebounce(swapAmount, defaultDebounceMs)[0]

  const enabled = options.enabled ?? true

  const inputs = {
    swapAmount: debouncedSwapAmount,
    swapType,
    tokenIn,
    tokenOut,
    chain,
  }

  const queryKey = swapQueryKeys.simulation(inputs)

  const queryFn = async () => handler.simulate(inputs)

  const queryOpts = {
    enabled,
    cacheTime: 0,
    ...onlyExplicitRefetch,
    onError(error: unknown) {
      captureSwapHandlerError(error, 'Error in add liquidity simulation query', {
        handler,
        swapInputs: inputs,
      })
    },
  }

  return useQuery<SimulateSwapResponse, Error>(queryKey, queryFn, queryOpts)
}
