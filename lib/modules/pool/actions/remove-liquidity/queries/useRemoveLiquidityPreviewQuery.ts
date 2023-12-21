'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { HumanAmount, TokenAmount } from '@balancer/sdk'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { isEmptyHumanAmount } from '../../LiquidityActionHelpers'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { generateRemoveLiquidityQueryKey } from './generateRemoveLiquidityQueryKey'

const debounceMillis = 300

export function useRemoveLiquidityBtpInQuery(
  handler: RemoveLiquidityHandler,
  humanBptIn: HumanAmount | '',
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [amountsOut, setAmountsOut] = useState<TokenAmount[] | undefined>(undefined)
  const [debouncedHumanBptIn] = useDebounce(humanBptIn, debounceMillis)

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      queryId: 'BptIn',
      userAddress,
      poolId,
      slippage,
      humanBptIn: debouncedHumanBptIn,
    })
  }

  async function queryBptIn() {
    const { amountsOut } = await handler.queryRemoveLiquidity({ humanBptIn: debouncedHumanBptIn })

    setAmountsOut(amountsOut)

    return amountsOut
  }

  const query = useQuery(
    [queryKey()],
    async () => {
      return await queryBptIn()
    },
    {
      enabled: isConnected && !isEmptyHumanAmount(debouncedHumanBptIn),
      onError: (error: Error) => console.log('Error in queryRemoveLiquidity', error.name),
    }
  )

  return { amountsOut, isPreviewQueryLoading: query.isLoading }
}
