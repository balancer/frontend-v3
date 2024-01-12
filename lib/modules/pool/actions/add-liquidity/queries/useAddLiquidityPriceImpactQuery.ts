'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { areEmptyAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'

export function useAddLiquidityPriceImpactQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  async function queryPriceImpact() {
    const _priceImpact = await handler.calculatePriceImpact(humanAmountsIn)

    setPriceImpact(_priceImpact)
    return _priceImpact
  }

  const query = useQuery(
    addLiquidityKeys.preview({
      userAddress,
      slippage,
      poolId,
      humanAmountsIn: debouncedHumanAmountsIn,
    }),
    async () => {
      return await queryPriceImpact()
    },
    {
      enabled: isConnected && !areEmptyAmounts(humanAmountsIn),
      cacheTime: 0,
    }
  )

  return { priceImpact, isPriceImpactLoading: query.isLoading, refetchPriceImpact: query.refetch }
}
