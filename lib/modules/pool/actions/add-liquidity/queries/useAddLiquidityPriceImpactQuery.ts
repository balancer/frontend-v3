'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { areEmptyAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'
import { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from 'wagmi'
import { usePool } from '../../../usePool'

export function useAddLiquidityPriceImpactQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  options: UseQueryOptions = {}
) {
  const { pool } = usePool()
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const enabled = options.enabled ?? true

  const queryKey = addLiquidityKeys.priceImpact({
    userAddress,
    slippage,
    pool,
    humanAmountsIn: debouncedHumanAmountsIn,
  })

  const queryFn = async () => handler.getPriceImpact(humanAmountsIn)

  const queryOpts = {
    enabled: enabled && isConnected && !areEmptyAmounts(debouncedHumanAmountsIn),
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
