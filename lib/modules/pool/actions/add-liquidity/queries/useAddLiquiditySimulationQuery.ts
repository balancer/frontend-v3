'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { areEmptyAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { AddLiquidityParams, addLiquidityKeys } from './add-liquidity-keys'
import { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from 'wagmi'
import { usePool } from '../../../usePool'
import { captureAddLiquidityHandlerError } from '@/lib/shared/utils/query-errors'

export type AddLiquiditySimulationQueryResult = ReturnType<typeof useAddLiquiditySimulationQuery>

export function useAddLiquiditySimulationQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  options: UseQueryOptions = {}
) {
  const { userAddress } = useUserAccount()
  const { pool } = usePool()
  const { slippage } = useUserSettings()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const enabled = options.enabled ?? true

  const params: AddLiquidityParams = {
    handler,
    userAddress,
    slippage,
    poolId: pool.id,
    poolType: pool.type,
    humanAmountsIn: debouncedHumanAmountsIn,
  }

  const queryKey = addLiquidityKeys.preview(params)

  const queryFn = async () => handler.simulate(humanAmountsIn)

  return useQuery(queryKey, queryFn, {
    enabled: enabled && !areEmptyAmounts(debouncedHumanAmountsIn),
    cacheTime: 0,
    ...onlyExplicitRefetch,
    onError(error: unknown) {
      captureAddLiquidityHandlerError(error, 'Error in add liquidity simulation query', params)
    },
  })
}
