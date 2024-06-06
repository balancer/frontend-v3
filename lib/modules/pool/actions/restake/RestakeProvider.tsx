/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { LABELS } from '@/lib/shared/labels'
import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { usePool } from '../../PoolProvider'
import { HumanAmount } from '@balancer/sdk'
import { bn, isZero } from '@/lib/shared/utils/numbers'
import { useRestakeSteps } from '../unstake/useRestakeSteps'
import { useNonPreferentialStaking } from './useNonPreferentialStaking'

export type UseRestakeResponse = ReturnType<typeof _useRestake>
export const RestakeContext = createContext<UseRestakeResponse | null>(null)

export function _useRestake() {
  const [restakeAmount, setRestakeAmount] = useState<HumanAmount>('0')

  const { pool, refetch: refetchPoolBalances } = usePool()
  const { nonPreferentialStakedBalance } = useNonPreferentialStaking(pool)
  const { isConnected } = useUserAccount()

  const { steps, isLoading } = useRestakeSteps(pool, restakeAmount, refetchPoolBalances)
  const transactionSteps = useTransactionSteps(steps, isLoading)

  const restakeTxHash = transactionSteps.lastTransaction?.result?.data?.transactionHash

  const { isDisabled, disabledReason } = isDisabledWithReason(
    [!isConnected, LABELS.walletNotConnected],
    [isZero(restakeAmount), "There's no staked amount to be migrated"]
  )

  /**
   * Side-effects
   */
  useEffect(() => {
    /*
      We need the initial restakeAmount during all the flow (from unstake to new stake),
      so we only set restakeAmount when it is > 0,
      (ignoring when nonPreferentialStakedBalance becomes zero dur to the unstake execution).
    */
    if (bn(nonPreferentialStakedBalance).gt(0)) {
      setRestakeAmount(nonPreferentialStakedBalance as HumanAmount)
    }
  }, [nonPreferentialStakedBalance])

  return {
    isLoading,
    transactionSteps,
    isDisabled: isDisabled,
    disabledReason: disabledReason,
    restakeTxHash,
    restakeAmount,
  }
}

export function RestakeProvider({ children }: PropsWithChildren) {
  const hook = _useRestake()
  return <RestakeContext.Provider value={hook}>{children}</RestakeContext.Provider>
}

export const useRestake = (): UseRestakeResponse => useMandatoryContext(RestakeContext, 'Restake')
