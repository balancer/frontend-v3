'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { RemoveLiquidityQueryOutput, TokenAmount } from '@balancer/sdk'
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
  const [bptIn, setBptIn] = useState<TokenAmount | null>(null)
  const [lastSdkQueryOutput, setLastSdkQueryOutput] = useState<
    RemoveLiquidityQueryOutput | undefined
  >(undefined)
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, debounceMillis)

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      queryId: 'BptIn',
      userAddress,
      poolId,
      slippage,
      humanAmountsIn: debouncedHumanAmountsIn as unknown as HumanAmountIn[],
    })
  }

  async function queryBptIn() {
    const queryResult = await handler.queryRemoveLiquidity({ humanAmountsIn })

    const { bptIn } = queryResult

    setBptIn(bptIn)

    // Only SDK handlers will return this output
    if (queryResult.sdkQueryOutput) {
      setLastSdkQueryOutput(queryResult.sdkQueryOutput)
    }
    return bptIn
  }

  const query = useQuery(
    [queryKey()],
    async () => {
      return await queryBptIn()
    },
    {
      enabled: isConnected && hasValidHumanAmounts(humanAmountsIn),
    }
  )

  // TODO: move to component
  // const bptOutUnits = bptIn ? fNum('integer', formatUnits(bptIn.amount, 18)) : '-'

  return { bptIn: bptIn, isBptInQueryLoading: query.isLoading, lastSdkQueryOutput }
}
