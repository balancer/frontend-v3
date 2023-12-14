/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { HumanAmountIn } from '../liquidity-types'
import { areEmptyAmounts } from '../LiquidityActionHelpers'

type IsDisabledIWithReasons = {
  isAddLiquidityDisabled: boolean
  addLiquidityDisabledReason?: string
}

export function useAddLiquidityDisabledWithReasons(
  amountsIn: HumanAmountIn[]
): IsDisabledIWithReasons {
  const { isConnected } = useUserAccount()

  if (!isConnected) {
    return disabled('You are not connected')
  }

  if (areEmptyAmounts(amountsIn)) {
    return disabled('You must specify one or more token amounts')
  }

  return { isAddLiquidityDisabled: false }
}

function disabled(reason: string): IsDisabledIWithReasons {
  return {
    isAddLiquidityDisabled: true,
    addLiquidityDisabledReason: reason,
  }
}
