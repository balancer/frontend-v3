'use client'

import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { Dictionary } from 'lodash'
import { Address, useQuery } from 'wagmi'
import { HumanAmountIn } from './add-liquidity.types'
import { usePool } from '../../usePool'
import { useAddLiquidity } from './useAddLiquidity'
import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildAddLiquidityQuery(
  humanAmountsIn: HumanAmountIn[],
  enabled: boolean,
  account?: Address
) {
  // const { allowances } = useTokenAllowances()
  const { poolStateInput, chainId } = usePool()
  const { buildAddLiquidityTx } = useAddLiquidity()
  const { slippage } = useUserSettings()
  const allowances = {}

  // TODO: improve queryKey management
  function queryKey(): string {
    return `${account}:${chainId}:${JSON.stringify(poolStateInput)}:${slippage}`
  }

  const addLiquidityQuery = useQuery(
    [queryKey()],
    async () => {
      return await buildAddLiquidityTx({
        humanAmountsIn,
        account: account || emptyAddress,
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
