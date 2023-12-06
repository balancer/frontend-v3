'use client'

import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Address, useQuery } from 'wagmi'
import { AddLiquidityConfigBuilder } from './AddLiquidityConfigBuilder'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { Dictionary } from 'lodash'
import { HumanAmountIn } from './add-liquidity.types'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildAddLiquidityQuery(
  addLiquidityConfigBuilder: AddLiquidityConfigBuilder,
  humanAmountsIn: HumanAmountIn[],
  enabled: boolean,
  account?: Address
) {
  // const { allowances } = useTokenAllowances()

  const allowances = {}

  const addLiquidityQuery = useQuery(
    [`useJoinPool:${account}:${addLiquidityConfigBuilder.queryKey}`],
    async () => {
      return await addLiquidityConfigBuilder.buildSdkAddLiquidityTxConfig(
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
  // TODO: depending on the user input this rule will be different
  // Here we will check that the user has enough allowance for the current Join operation
  return Object.values(tokenAllowances).every(a => a > 0n)
}
