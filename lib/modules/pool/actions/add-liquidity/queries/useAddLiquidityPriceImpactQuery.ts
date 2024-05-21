'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { areEmptyAmounts } from '../../LiquidityActionHelpers'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { AddLiquidityParams, addLiquidityKeys } from './add-liquidity-keys'
import { useQuery } from '@tanstack/react-query'
import { usePool } from '../../../usePool'
import { sentryMetaForAddLiquidityHandler } from '@/lib/shared/utils/query-errors'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'

export type PriceImpactQueryResult = ReturnType<typeof useAddLiquidityPriceImpactQuery>

type Params = {
  handler: AddLiquidityHandler
  humanAmountsIn: HumanTokenAmountWithAddress[]
  enabled: boolean
}

export function useAddLiquidityPriceImpactQuery({ handler, humanAmountsIn, enabled }: Params) {
  const { pool } = usePool()
  const { userAddress, isConnected } = useUserAccount()
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

  const queryKey = addLiquidityKeys.priceImpact(params)

  const queryFn = async () => handler.getPriceImpact(humanAmountsIn)

  return useQuery({
    queryKey,
    queryFn,
    enabled: enabled && isConnected && !areEmptyAmounts(debouncedHumanAmountsIn),
    gcTime: 0,
    meta: sentryMetaForAddLiquidityHandler('Error in add liquidity priceImpact query', params),
    ...onlyExplicitRefetch,
  })
}

/*
 ABA priceImpact calculation has some known limitations. Examples:
 - You can’t calculate it for add liquidity amounts that are higher than the pool balance (it will return a BAL#001 error)
 - Add Liquidity Unbalanced uses a querySwap and Weighted pools have a limit that you can’t swap > 30% of the token balance in the pool
 for add liquidity amounts that are higher than the pool balance (it will return a BAL#001 error)

 For now, if we receive a ContractFunctionExecutionError we will assume that it is an ABA limitation and we will show an "unknown price impact" warning to the user.

 Note that the SDK error could change, so we should keep an eye on it.
 */
export function isUnhandledAddPriceImpactError(error: Error | null): boolean {
  if (!error) return false
  if (cannotCalculatePriceImpactError(error)) return false
  return true
}

export function cannotCalculatePriceImpactError(error: Error | null): boolean {
  if (error && error.name === 'ContractFunctionExecutionError') {
    return true
  }
  return false
}
