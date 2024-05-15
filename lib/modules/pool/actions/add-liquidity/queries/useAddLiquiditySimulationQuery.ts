'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { areEmptyAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { AddLiquidityParams, addLiquidityKeys } from './add-liquidity-keys'
import { useQuery } from '@tanstack/react-query'
import { usePool } from '../../../usePool'
import { sentryMetaForAddLiquidityHandler } from '@/lib/shared/utils/query-errors'

export type AddLiquiditySimulationQueryResult = ReturnType<typeof useAddLiquiditySimulationQuery>

type Params = {
  handler: AddLiquidityHandler
  humanAmountsIn: HumanAmountIn[]
  enabled: boolean
}

export function useAddLiquiditySimulationQuery({ handler, humanAmountsIn, enabled }: Params) {
  const { userAddress } = useUserAccount()
  const { pool } = usePool()
  const { slippage } = useUserSettings()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const params: AddLiquidityParams = {
    handler,
    userAddress,
    slippage,
    poolId: pool.id,
    poolType: pool.type,
    humanAmountsIn: debouncedHumanAmountsIn,
  }

  const queryKey = addLiquidityKeys.preview(params)

  const queryFn = async () => handler.simulate(debouncedHumanAmountsIn)

  return useQuery({
    queryKey,
    queryFn,
    enabled: enabled && !areEmptyAmounts(debouncedHumanAmountsIn),
    gcTime: 0,
    meta: sentryMetaForAddLiquidityHandler('Error in add liquidity simulation query', params),
    ...onlyExplicitRefetch,
  })
}
