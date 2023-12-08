'use client'

import { Dictionary } from 'lodash'
import { Address, useQuery } from 'wagmi'
import { AddLiquidityService } from './AddLiquidityService'
import { HumanAmountIn } from './add-liquidity.types'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildAddLiquidityQuery(
  AddLiquidityService: AddLiquidityService,
  humanAmountsIn: HumanAmountIn[],
  enabled: boolean,
  account?: Address
) {
  const { slippage } = useUserSettings()
  // const { allowances } = useTokenAllowances()
  const allowances = {}

  const addLiquidityQuery = useQuery(
    [`useJoinPool:${account}:${JSON.stringify(humanAmountsIn)}`],
    async () => {
      return await AddLiquidityService.buildAddLiqudityTx({
        account,
        humanAmountsIn,
        slippagePercent: slippage,
      })
    },
    {
      enabled: enabled && !!account && allowances && hasTokenAllowance(allowances),
    }
  )

  return addLiquidityQuery
}

function hasTokenAllowance(tokenAllowances: Dictionary<bigint>) {
  // TODO: depending on the user humanAmountsIn this rule will be different
  // Here we will check that the user has enough allowance for the current Join operation
  return Object.values(tokenAllowances).every(a => a > 0n)
}
