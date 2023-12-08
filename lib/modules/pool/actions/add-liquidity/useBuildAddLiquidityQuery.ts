'use client'

import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Dictionary } from 'lodash'
import { Address, useQuery } from 'wagmi'
import { AddLiquidityService } from './AddLiquidityService'
import { HumanAmountIn } from './add-liquidity.types'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildAddLiquidityQuery(
  AddLiquidityService: AddLiquidityService,
  humanAmountsIn: HumanAmountIn[],
  enabled: boolean,
  account?: Address
) {
  // const { allowances } = useTokenAllowances()

  const allowances = {}

  const addLiquidityQuery = useQuery(
    [`useJoinPool:${account}:${AddLiquidityService.queryKey}`],
    async () => {
      return await AddLiquidityService.buildSdkAddLiquidityTxConfig(
        account || emptyAddress,
        humanAmountsIn
      )
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
