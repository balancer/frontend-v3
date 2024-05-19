/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { createContext, PropsWithChildren, useEffect, useState } from 'react'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { useStakeSteps } from './useStakeSteps'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { bn } from '@/lib/shared/utils/numbers'
import { HumanAmount } from '@balancer/sdk'

export type UseStakeResponse = ReturnType<typeof _useStake>
export const StakeContext = createContext<UseStakeResponse | null>(null)

export function _useStake() {
  const { userAddress, isConnected } = useUserAccount()
  const { pool, chainId, isLoadingOnchainUserBalances } = usePool()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  // To maintain amount in modal after confirmation
  const [quoteAmountIn, setQuoteAmountIn] = useState<HumanAmount>('0')
  const [quoteAmountInUsd, setQuoteAmountInUsd] = useState<HumanAmount>('0')

  const stakableBalance = (pool.userBalance?.walletBalance || '0') as HumanAmount
  const stakableBalanceUsd = (pool.userBalance?.walletBalanceUsd || '0') as HumanAmount

  const tokenAllowances = useTokenAllowances({
    chainId,
    userAddress,
    spenderAddress: pool.staking?.address as Address,
    tokenAddresses: [pool.address as Address],
  })

  /**
   * Step construction
   */
  const { isLoadingSteps, steps } = useStakeSteps(pool)
  const transactionSteps = useTransactionSteps(steps, isLoadingSteps)

  const stakeTxHash = transactionSteps.lastTransaction?.result?.data?.transactionHash

  /**
   * Side-effects
   */
  useEffect(() => {
    const newBalance = (pool.userBalance?.walletBalance || '0') as HumanAmount
    const newBalanceUsd = (pool.userBalance?.walletBalanceUsd || '0') as HumanAmount

    if (bn(newBalance).gt(0)) {
      setQuoteAmountIn(newBalance)
      setQuoteAmountInUsd(newBalanceUsd)
    }
  }, [pool.userBalance?.walletBalance, isLoadingOnchainUserBalances])

  return {
    transactionSteps,
    isDisabled,
    disabledReason,
    quoteAmountIn,
    quoteAmountInUsd,
    stakableBalance,
    stakableBalanceUsd,
    tokenAllowances,
    stakeTxHash,
    isLoading: isLoadingSteps,
  }
}

export function StakeProvider({ children }: PropsWithChildren) {
  const hook = _useStake()
  return <StakeContext.Provider value={hook}>{children}</StakeContext.Provider>
}

export const useStake = (): UseStakeResponse => useMandatoryContext(StakeContext, 'Stake')
