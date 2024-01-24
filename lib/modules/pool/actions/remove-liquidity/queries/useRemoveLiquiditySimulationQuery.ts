'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { HumanAmount } from '@balancer/sdk'
import { useDebounce } from 'use-debounce'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'
import { UseQueryOptions } from '@tanstack/react-query'

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

  const queryKey = removeLiquidityKeys.preview({
    handler,
    userAddress,
    slippage,
    poolId,
    humanBptIn: debouncedHumanBptIn,
    tokenOut,
  })

  const queryFn = async () =>
    handler.queryRemoveLiquidity({
      humanBptIn: debouncedHumanBptIn,
      tokenOut,
    })

  const queryOpts = {
    enabled: enabled && isConnected && Number(debouncedHumanBptIn) > 0,
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
