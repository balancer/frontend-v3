/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { useClaimAndUnstakeSteps } from './useClaimAndUnstakeSteps'
import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { createContext, PropsWithChildren, useEffect, useMemo, useState } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { usePool } from '../../usePool'
import { useClaiming } from '../claim/useClaiming'
import { PoolListItem } from '../../pool.types'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { HumanAmount } from '@balancer/sdk'
import { bn } from '@/lib/shared/utils/numbers'

export type UseUnstakeResponse = ReturnType<typeof _useUnstake>
export const UnstakeContext = createContext<UseUnstakeResponse | null>(null)

export function _useUnstake() {
  // State so that we can maintain the amounts in the modal after confirmation.
  const [quoteAmountOut, setQuoteAmountOut] = useState<HumanAmount>('0')
  const [quoteAmountOutUsd, setQuoteAmountOutUsd] = useState<HumanAmount>('0')
  const [quoteRewardAmounts, setQuoteRewardAmounts] = useState<HumanTokenAmountWithAddress[]>([])
  const [quoteTotalClaimableUsd, setQuoteTotalClaimableUsd] = useState<string>('0')

  const { pool, isLoadingOnchainUserBalances, refetch: refetchPoolBalances } = usePool()
  const { isConnected } = useUserAccount()

  const {
    hasNoRewards,
    allClaimableRewards,
    totalClaimableUsd,
    isDisabled: isClaimDisabled,
    disabledReason: claimDisabledReason,
    isLoading: isLoadingClaims,
  } = useClaiming([pool] as unknown[] as PoolListItem[])

  const rewardAmounts: HumanTokenAmountWithAddress[] = useMemo(
    () =>
      allClaimableRewards.map(reward => ({
        tokenAddress: reward.tokenAddress,
        humanAmount: reward.humanBalance as HumanAmount,
      })),
    [allClaimableRewards]
  )

  const { steps, isLoading } = useClaimAndUnstakeSteps(pool, refetchPoolBalances)
  const transactionSteps = useTransactionSteps(steps, isLoading)

  const unstakeTxHash = transactionSteps.lastTransaction?.result?.data?.transactionHash

  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  /**
   * Side-effects
   */
  useEffect(() => {
    const newBalance = (pool.userBalance?.stakedBalance || '0') as HumanAmount
    const newBalanceUsd = (pool.userBalance?.stakedBalanceUsd || '0') as HumanAmount

    if (bn(newBalance).gt(0)) {
      setQuoteAmountOut(newBalance)
      setQuoteAmountOutUsd(newBalanceUsd)
    }
  }, [pool.userBalance?.stakedBalance, isLoadingOnchainUserBalances])

  useEffect(() => {
    setQuoteRewardAmounts(rewardAmounts)
    setQuoteTotalClaimableUsd(totalClaimableUsd)
  }, [isLoadingClaims])

  return {
    isLoading: isLoadingClaims || isLoading,
    transactionSteps,
    isDisabled: isDisabled || isClaimDisabled,
    disabledReason: disabledReason || claimDisabledReason,
    rewardAmounts,
    totalClaimableUsd,
    hasNoRewards,
    unstakeTxHash,
    quoteAmountOut,
    quoteAmountOutUsd,
    quoteRewardAmounts,
    quoteTotalClaimableUsd,
  }
}

export function UnstakeProvider({ children }: PropsWithChildren) {
  const hook = _useUnstake()
  return <UnstakeContext.Provider value={hook}>{children}</UnstakeContext.Provider>
}

export const useUnstake = (): UseUnstakeResponse => useMandatoryContext(UnstakeContext, 'Unstake')
