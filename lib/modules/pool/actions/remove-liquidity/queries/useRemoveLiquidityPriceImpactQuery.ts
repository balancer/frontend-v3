'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { generateRemoveLiquidityQueryKey } from './generateRemoveLiquidityQueryKey'
import { HumanAmount } from '@balancer/sdk'
import { isEmpty } from 'lodash'
import { defaultDebounceMillis } from '@/lib/shared/utils/queries'

export function useRemoveLiquidityPriceImpactQuery(
  handler: RemoveLiquidityHandler,
  poolId: string,
  humanBptIn: HumanAmount | ''
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const [debouncedHumanBptIn] = useDebounce(humanBptIn, defaultDebounceMillis)

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      queryId: 'PriceImpact',
      userAddress,
      poolId,
      slippage,
      humanBptIn: debouncedHumanBptIn,
    })
  }

  async function queryPriceImpact() {
    const _priceImpact = await handler.calculatePriceImpact({
      humanBptIn: debouncedHumanBptIn,
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
      enabled: isConnected && !isEmpty(debouncedHumanBptIn),
    }
  )

  return { priceImpact, isPriceImpactLoading: query.isLoading }
}
