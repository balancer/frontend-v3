'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { priceImpactFormat } from '@/lib/shared/utils/numbers'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { areEmptyAmounts } from '../add-liquidity.helpers'
import { HumanAmountIn } from '../add-liquidity.types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { generateAddLiquidityQueryKey } from './generateAddLiquidityQueryKey'

const debounceMillis = 250

export function useAddLiquidityPriceImpactQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress } = useUserAccount()
  const { slippage } = useUserSettings()
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, debounceMillis)

  function queryKey(): string {
    return generateAddLiquidityQueryKey({
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
      enabled: !!userAddress && !areEmptyAmounts(humanAmountsIn),
    }
  )
  const formattedPriceImpact = priceImpact ? priceImpactFormat(priceImpact) : '-'

  return { priceImpact, formattedPriceImpact, isPriceImpactLoading: query.isLoading }
}
