'use client'

import { useUserSettings } from '@/lib/modules/user/settings/useUserSettings'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { AddLiquidityQueryOutput } from '@balancer/sdk'
import { Dictionary } from 'lodash'
import { useQuery } from 'wagmi'
import { HumanAmountIn } from '../../liquidity-types'
import { AddLiquidityHandler } from '../handlers/AddLiquidity.handler'
import { generateAddLiquidityQueryKey } from './generateAddLiquidityQueryKey'

// Uses the SDK to build a transaction config to be used by wagmi's useManagedSendTransaction
export function useBuildAddLiquidityQuery(
  handler: AddLiquidityHandler,
  humanAmountsIn: HumanAmountIn[],
  isActiveStep: boolean,
  poolId: string,
  lastSdkQueryOutput?: AddLiquidityQueryOutput
) {
  const { userAddress, isConnected } = useUserAccount()
  const { slippage } = useUserSettings()

  //TODO: fix this
  const allowances = {}

  function queryKey(): string {
    return generateAddLiquidityQueryKey({
      userAddress,
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
        account: userAddress,
        slippagePercent: slippage,
      }
      // There are edge cases where we will never call setLastSdkQueryOutput so that lastSdkQueryOutput will be undefined.
      // That`s expected as sdkQueryOutput is an optional input
      return handler.buildAddLiquidityTx({ inputs, sdkQueryOutput: lastSdkQueryOutput })
    },
    {
      enabled:
        isActiveStep && // If the step is not active (the user did not click Next button) avoid running the build tx query to save RPC requests
        isConnected &&
        allowances &&
        hasTokenAllowance(allowances),
    }
  )

  return addLiquidityQuery
}

function hasTokenAllowance(tokenAllowances: Dictionary<bigint>) {
  // TODO: depending on the user humanAmountsIn this rule will be different
  // Here we will check that the user has enough allowance for the current Join operation
  return Object.values(tokenAllowances).every(a => a > 0n)
}
