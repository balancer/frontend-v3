'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Dictionary } from 'lodash'
import { useQuery } from 'wagmi'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { generateRemoveLiquidityQueryKey } from './generateRemoveLiquidityQueryKey'
import { HumanAmountIn } from '../../liquidity-types'

// Queries the SDK to create a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildRemoveLiquidityQuery(
  humanAmountsIn: HumanAmountIn[],
  enabled: boolean,
  poolId: string
) {
  const { userAddress } = useUserAccount()

  const { buildRemoveLiquidityTx } = useRemoveLiquidity()
  const { slippage } = useUserSettings()
  const allowances = {}

  function queryKey(): string {
    return generateRemoveLiquidityQueryKey({
      userAddress: userAddress || emptyAddress,
      poolId,
      slippage,
      humanAmountsIn,
    })
  }

  const addLiquidityQuery = useQuery(
    [queryKey()],
    async () => {
      const inputs = {
        humanAmountsIn,
        account: userAddress || emptyAddress,
        slippagePercent: slippage,
      }
      return await buildRemoveLiquidityTx(inputs)
    },
    {
      enabled: enabled && !!userAddress && allowances && hasTokenAllowance(allowances),
    }
  )

  return addLiquidityQuery
}

function hasTokenAllowance(tokenAllowances: Dictionary<bigint>) {
  // TODO: depending on the user humanAmountsIn this rule will be different
  // Here we will check that the user has enough allowance for the current remove liquidity operation
  return Object.values(tokenAllowances).every(a => a > 0n)
}
