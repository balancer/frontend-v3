'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { TokenAmount } from '@balancer/sdk'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { hasValidHumanAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { generateAddLiquidityQueryKey } from './generateAddLiquidityQueryKey'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'

export function useAddLiquidityPreviewQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [bptOut, setBptOut] = useState<TokenAmount | null>(null)
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  function queryKey(): string {
    return generateAddLiquidityQueryKey({
      userAddress,
      poolId,
      slippage,
      humanAmountsIn: debouncedHumanAmountsIn,
    })
  }

  async function queryBptOut() {
    const queryResult = await handler.queryAddLiquidity({ humanAmountsIn })

    const { bptOut } = queryResult

    setBptOut(bptOut)

    return bptOut
  }

  const query = useQuery(
    [queryKey()],
    async () => {
      return await queryBptOut()
    },
    {
      enabled: isConnected && hasValidHumanAmounts(humanAmountsIn),
      // TODO: remove when finishing debugging
      onError: error => console.log('Error in queryBptOut', error),
    }
  )

  return { bptOut, isPreviewQueryLoading: query.isLoading }
}
