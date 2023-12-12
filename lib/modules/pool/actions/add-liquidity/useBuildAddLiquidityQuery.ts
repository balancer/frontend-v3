'use client'

import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Dictionary } from 'lodash'
import { Address, useQuery } from 'wagmi'
import { HumanAmountIn } from './add-liquidity.types'
import { useAddLiquidity } from './useAddLiquidity'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildAddLiquidityQuery(
  humanAmountsIn: HumanAmountIn[],
  enabled: boolean,
  account?: Address
) {
  // const { allowances } = useTokenAllowances()
  const allowances = {}

  const { handler } = useAddLiquidity()

  const addLiquidityQuery = useQuery(
    [`useJoinPool:${account}:${handler.queryKey}`],
    async () => {
      //TODO: set slippage from the UI
      // const defaultSlippage = Slippage.fromPercentage('0.2')
      const defaultSlippage = '0.2'
      return await handler.buildAddLiquidityTx({
        humanAmountsIn,
        account: account || emptyAddress,
        slippagePercent: defaultSlippage,
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
