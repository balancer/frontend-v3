'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { generateRemoveLiquidityQueryKey } from './generateRemoveLiquidityQueryKey'
import { HumanAmountIn } from '../../liquidity-types'
import { areEmptyAmounts } from '../../LiquidityActionHelpers'
import { fNum } from '@/lib/shared/utils/numbers'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'

const debounceMillis = 250

export function useRemoveLiquidityPriceImpactQuery(
  handler: RemoveLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, debounceMillis)

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      userAddress,
      poolId,
      slippage,
      humanAmountsIn: debouncedHumanAmountsIn as unknown as HumanAmountIn[],
    })
  }

  async function queryPriceImpact() {
    const _priceImpact = await handler.calculatePriceImpact({
      humanAmountsIn,
    })

    setPriceImpact(_priceImpact)
    return _priceImpact
  }

  const query = useQuery(
    [queryKey()],
    async () => {
      return await queryPriceImpact()
    },
    {
      enabled: isConnected && !areEmptyAmounts(humanAmountsIn),
    }
  )

  // TODO: Move to component
  // const formattedPriceImpact = priceImpact ? fNum('priceImpact', priceImpact) : '-'

  return { priceImpact, isPriceImpactLoading: query.isLoading }
}
