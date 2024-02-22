'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { hasValidHumanAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'
import { UseQueryOptions } from '@tanstack/react-query'
import { useQuery } from 'wagmi'
import { usePool } from '../../../usePool'

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

  const queryKey = addLiquidityKeys.preview({
    userAddress,
    slippage,
    pool,
    humanAmountsIn: debouncedHumanAmountsIn,
  })

  // Only NestedAddLiquidity expects a userAddress
  // TODO: The sdk team is going to remove userAddress from the nested query signature to simplify this:
  // https://github.com/balancer/b-sdk/issues/209
  const queryFn = async () => handler.simulate(humanAmountsIn, userAddress)

  const queryOpts = {
    enabled: enabled && hasValidHumanAmounts(debouncedHumanAmountsIn),
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
