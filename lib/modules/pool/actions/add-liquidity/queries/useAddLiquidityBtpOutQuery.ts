'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { AddLiquidityQueryOutput, TokenAmount } from '@balancer/sdk'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { formatUnits } from 'viem'
import { useQuery } from 'wagmi'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { generateAddLiquidityQueryKey } from './generateAddLiquidityQueryKey'
import { HumanAmountIn } from '../../liquidity-types'
import { areEmptyAmounts } from '../../LiquidityActionHelpers'
import { fNum } from '@/lib/shared/utils/numbers'

const debounceMillis = 300

export function useAddLiquidityBtpOutQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { userAddress } = useUserAccount()
  const { slippage } = useUserSettings()
  const [bptOut, setBptOut] = useState<TokenAmount | null>(null)
  const [lastSdkQueryOutput, setLastSdkQueryOutput] = useState<AddLiquidityQueryOutput | undefined>(
    undefined
  )
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, debounceMillis)

  function queryKey(): string {
    return generateAddLiquidityQueryKey({
      userAddress,
      poolId,
      slippage,
      humanAmountsIn: debouncedHumanAmountsIn as unknown as HumanAmountIn[],
    })
  }

  async function queryBptOut() {
    const queryResult = await handler.queryAddLiquidity({ humanAmountsIn })

    const { bptOut } = queryResult

    setBptOut(bptOut)

    // Only SDK handlers will return this output
    if (queryResult.sdkQueryOutput) {
      setLastSdkQueryOutput(queryResult.sdkQueryOutput)
    }
    return bptOut
  }

  const query = useQuery(
    [queryKey()],
    async () => {
      return await queryBptOut()
    },
    {
      enabled: !!userAddress && !areEmptyAmounts(humanAmountsIn),
    }
  )

  const bptOutUnits = bptOut ? fNum('token', formatUnits(bptOut.amount, 18)) : '-'

  return { bptOut, bptOutUnits, isBptOutQueryLoading: query.isLoading, lastSdkQueryOutput }
}
