'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'
import { HumanAmount } from '@balancer/sdk'

export function useRemoveLiquidityPriceImpactQuery(
  handler: RemoveLiquidityHandler,
  poolId: string,
  humanBptIn: HumanAmount,
  tokenOut?: Address
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [priceImpact, setPriceImpact] = useState<number | null>(null)
  const debouncedBptIn = useDebounce(humanBptIn, defaultDebounceMs)[0]

  async function queryPriceImpact() {
    const _priceImpact = await handler.calculatePriceImpact({
      humanBptIn: debouncedBptIn,
      tokenOut,
    })

    setPriceImpact(_priceImpact)
    return _priceImpact
  }

  const query = useQuery(
    removeLiquidityKeys.priceImpact({
      handler,
      userAddress,
      slippage,
      poolId,
      humanBptIn: humanBptIn,
      tokenOut,
    }),
    async () => {
      return await queryPriceImpact()
    },
    {
      enabled: isConnected && Number(debouncedBptIn) > 0,
    }
  )

  return { priceImpact, isPriceImpactLoading: query.isLoading }
}
