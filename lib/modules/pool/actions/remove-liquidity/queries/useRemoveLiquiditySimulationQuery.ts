'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { HumanAmount } from '@balancer/sdk'
import { useDebounce } from 'use-debounce'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { RemoveLiquidityParams, removeLiquidityKeys } from './remove-liquidity-keys'
import { UseQueryOptions } from '@tanstack/react-query'
import { captureLiquidityHandlerError } from '@/lib/shared/utils/query-errors'

export type RemoveLiquiditySimulationQueryResult = ReturnType<
  typeof useRemoveLiquiditySimulationQuery
>

export function useRemoveLiquiditySimulationQuery(
  handler: RemoveLiquidityHandler,
  poolId: string,
  humanBptIn: HumanAmount,
  tokenOut: Address,
  options: UseQueryOptions = {}
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedHumanBptIn = useDebounce(humanBptIn, defaultDebounceMs)[0]

  const enabled = options.enabled ?? true

  const params: RemoveLiquidityParams = {
    handler,
    userAddress,
    slippage,
    poolId,
    humanBptIn: debouncedHumanBptIn,
    tokenOut,
  }
  const queryKey = removeLiquidityKeys.preview(params)

  const queryFn = async () =>
    handler.simulate({
      humanBptIn: debouncedHumanBptIn,
      tokenOut,
    })

  const result = useQuery(queryKey, queryFn, {
    enabled: enabled && isConnected && Number(debouncedHumanBptIn) > 0,
    cacheTime: 0,
    onError(error: unknown) {
      captureLiquidityHandlerError(error, 'Error in remove liquidity simulation query', params)
    },
    ...onlyExplicitRefetch,
  })
  return result
}
