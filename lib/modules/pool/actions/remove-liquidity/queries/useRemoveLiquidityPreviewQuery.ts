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
  humanBptIn: HumanAmount,
  tokenOut?: Address
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [amountsOut, setAmountsOut] = useState<TokenAmount[] | undefined>(undefined)
  const debouncedHumanBptIn = useDebounce(humanBptIn, defaultDebounceMs)[0]

  async function queryBptIn() {
    const { amountsOut } = await handler.queryRemoveLiquidity({
      humanBptIn: debouncedHumanBptIn,
      tokenOut,
    })

    setAmountsOut(amountsOut)

    return amountsOut
  }

  const query = useQuery(
    removeLiquidityKeys.preview({
      handler,
      userAddress,
      slippage,
      poolId,
      humanBptIn: debouncedHumanBptIn,
      tokenOut,
    }),
    async () => {
      return await queryBptIn()
    },
    {
      enabled: isConnected && Number(debouncedHumanBptIn) > 0,
    }
  )

  return { amountsOut, isPreviewQueryLoading: query.isLoading }
}
