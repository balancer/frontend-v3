'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { defaultDebounceMs } from '@/lib/shared/utils/queries'
import { TokenAmount } from '@balancer/sdk'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from 'wagmi'
import { hasValidHumanAmounts } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { addLiquidityKeys } from './add-liquidity-keys'

export function useAddLiquidityPreviewQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()
  const [bptOut, setBptOut] = useState<TokenAmount | null>(null)
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, defaultDebounceMs)[0]

  async function queryBptOut() {
    const queryResult = await handler.queryAddLiquidity({ humanAmountsIn })

    const { bptOut } = queryResult

    setBptOut(bptOut)

    return bptOut
  }

  const query = useQuery(
    addLiquidityKeys.priceImpact({
      userAddress,
      slippage,
      poolId,
      humanAmountsIn: debouncedHumanAmountsIn,
    }),
    async () => {
      return await queryBptOut()
    },
    {
      enabled: isConnected && hasValidHumanAmounts(debouncedHumanAmountsIn),
      // TODO: remove when finishing debugging
      onError: error => console.log('Error in queryBptOut', error),
    }
  )

  return { bptOut, isPreviewQueryLoading: query.isLoading }
}
