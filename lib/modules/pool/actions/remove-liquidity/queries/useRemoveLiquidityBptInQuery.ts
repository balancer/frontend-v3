'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { TokenAmount } from '@balancer/sdk'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { hasValidHumanAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { generateRemoveLiquidityQueryKey } from './generateRemoveLiquidityQueryKey'

const debounceMillis = 300

export function useRemoveLiquidityBtpInQuery(
  handler: RemoveLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [bptIn, setBptIn] = useState<TokenAmount | undefined>(undefined)
  const [debouncedHumanAmountsIn] = useDebounce(humanAmountsIn, debounceMillis)

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      queryId: 'BptIn',
      userAddress,
      poolId,
      slippage,
      humanAmountsIn: debouncedHumanAmountsIn,
    })
  }

  async function queryBptIn() {
    const { bptIn } = await handler.queryRemoveLiquidity({ humanAmountsIn })

    setBptIn(bptIn)

    return bptIn
  }

  const query = useQuery(
    [queryKey()],
    async () => {
      return await queryBptIn()
    },
    {
      enabled: isConnected && hasValidHumanAmounts(debouncedHumanAmountsIn),
      onError: (error: Error) => console.log('Error in  queryRemoveLiquidity', error.name),
    }
  )

  return { bptIn, isBptInQueryLoading: query.isLoading }
}
