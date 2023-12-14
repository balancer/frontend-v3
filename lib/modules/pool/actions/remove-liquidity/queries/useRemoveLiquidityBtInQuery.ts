'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { integerFormat } from '@/lib/shared/utils/numbers'
import { RemoveLiquidityQueryOutput, TokenAmount } from '@balancer/sdk'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'
import { formatUnits } from 'viem'
import { useQuery } from 'wagmi'
import { generateRemoveLiquidityQueryKey } from './generateAddLiquidityQueryKey'
import { RemoveLiquidityHandler } from '../handlers/RemoveLiquidity.handler'
import { HumanAmountIn } from '../../liquidity-types'
import { areEmptyAmounts } from '../../LiquidityActionHelpers'

const debounceMillis = 300

export function useRemoveLiquidityBtpOutQuery(
  handler: RemoveLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  poolId: string
) {
  const { address: userAddress } = useUserAccount()
  const { slippage } = useUserSettings()
  const [bptIn, setBptIn] = useState<TokenAmount | null>(null)
  const [lastSdkQueryOutput, setLastSdkQueryOutput] = useState<
    RemoveLiquidityQueryOutput | undefined
  >(undefined)
  const debouncedHumanAmountsIn = useDebounce(humanAmountsIn, debounceMillis)

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      userAddress: userAddress || emptyAddress,
      poolId,
      slippage,
      humanAmountsIn: debouncedHumanAmountsIn as unknown as HumanAmountIn[],
    })
  }

  async function queryBptOut() {
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
      return await queryBptOut()
    },
    {
      enabled: !!userAddress && !areEmptyAmounts(humanAmountsIn),
    }
  )

  const bptOutUnits = bptIn ? integerFormat(formatUnits(bptIn.amount, 18)) : '-'

  return { bptIn: bptIn, bptOutUnits, isBptOutQueryLoading: query.isLoading, lastSdkQueryOutput }
}
