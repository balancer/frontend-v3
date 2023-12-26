'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'
import { TokenAmount } from '@balancer/sdk'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { Address, useQuery } from 'wagmi'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { removeLiquidityKeys } from './remove-liquidity-keys'

export function useRemoveLiquidityPreviewQuery(
  handler: RemoveLiquidityHandler,
  poolId: string,
  bptIn: bigint,
  tokenOut?: Address
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [amountsOut, setAmountsOut] = useState<TokenAmount[] | undefined>(undefined)
  const debouncedBptIn = useDebounce(bptIn, defaultDebounceMs)[0]

  async function queryBptIn() {
    const { amountsOut } = await handler.queryRemoveLiquidity({ bptIn: debouncedBptIn })

    setAmountsOut(amountsOut)

    return amountsOut
  }

  const query = useQuery(
    removeLiquidityKeys.preview({
      userAddress,
      slippage,
      poolId,
      bptIn,
      tokenOut,
    }),
    async () => {
      return await queryBptIn()
    },
    {
      enabled: isConnected && debouncedBptIn > 0n,
      onError: (error: Error) => console.log('Error in queryRemoveLiquidity', error.name),
    }
  )

  return { amountsOut, isPreviewQueryLoading: query.isLoading }
}
