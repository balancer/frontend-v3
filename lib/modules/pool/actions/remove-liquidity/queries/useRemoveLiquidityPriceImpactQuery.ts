'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { generateRemoveLiquidityQueryKey } from './generateRemoveLiquidityQueryKey'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'

export function useRemoveLiquidityPriceImpactQuery(
  handler: RemoveLiquidityHandler,
  poolId: string,
  bptIn: bigint
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const debouncedBptIn = useDebounce(bptIn, defaultDebounceMs)[0]

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      queryId: 'PriceImpact',
      userAddress,
      poolId,
      slippage,
      bptIn: debouncedBptIn,
    })
  }

  async function queryPriceImpact() {
    const _priceImpact = await handler.calculatePriceImpact({
      bptIn: debouncedBptIn,
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
      enabled: isConnected && debouncedBptIn > 0n,
    }
  )

  return { priceImpact, isPriceImpactLoading: query.isLoading }
}
