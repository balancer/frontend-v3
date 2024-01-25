'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs, onlyExplicitRefetch } from '@/lib/shared/utils/queries'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { hasValidHumanAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'
import { UseQueryOptions } from '@tanstack/react-query'

export type AddLiquiditySimulationQueryResult = ReturnType<typeof useAddLiquiditySimulationQuery>

export function useAddLiquiditySimulationQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string,
  options: UseQueryOptions = {}
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  const enabled = options.enabled ?? true

  const queryKey = addLiquidityKeys.preview({
    userAddress,
    slippage,
    poolId,
    humanAmountsIn: debouncedHumanAmountsIn,
  })

  const queryFn = async () => handler.simulate(humanAmountsIn)

  const queryOpts = {
    enabled: enabled && isConnected && hasValidHumanAmounts(debouncedHumanAmountsIn),
    cacheTime: 0,
    ...onlyExplicitRefetch,
  }

  return useQuery(queryKey, queryFn, queryOpts)
}
