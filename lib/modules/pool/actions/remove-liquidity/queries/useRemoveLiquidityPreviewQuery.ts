'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'
import { HumanAmount, TokenAmount } from '@balancer/sdk'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'

export type RemoveLiquidityPreviewQueryResult = ReturnType<typeof useRemoveLiquidityPreviewQuery>

export function useRemoveLiquidityPreviewQuery(
  handler: RemoveLiquidityHandler,
  poolId: string,
  bptInUnits: HumanAmount,
  tokenOut?: Address
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [amountsOut, setAmountsOut] = useState<TokenAmount[] | undefined>(undefined)
  const debouncedBptInUnits = useDebounce(bptInUnits, defaultDebounceMs)[0]

  async function queryBptIn() {
    const { amountsOut } = await handler.queryRemoveLiquidity({
      bptInUnits: debouncedBptInUnits,
      tokenOut,
    })

    setAmountsOut(amountsOut)

    return amountsOut
  }

  const query = useQuery(
    removeLiquidityKeys.preview({
      type: handler.type,
      userAddress,
      slippage,
      poolId,
      bptInUnits: debouncedBptInUnits,
      tokenOut,
    }),
    async () => {
      return await queryBptIn()
    },
    {
      enabled: isConnected && Number(debouncedBptInUnits) > 0,
    }
  )

  return { amountsOut, isPreviewQueryLoading: query.isLoading }
}
