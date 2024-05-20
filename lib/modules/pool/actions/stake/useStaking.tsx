/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useTransactionSteps } from '@/lib/modules/transactions/transaction-steps/useTransactionSteps'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { usePool } from '../../usePool'
import { useStakingSteps } from './useStakingSteps'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'

export function useStaking() {
  const [humanAmountIn, setHumanAmountIn] = useState<HumanTokenAmountWithAddress | null>(null)

  const { userAddress, isConnected } = useUserAccount()
  const { pool, chainId } = usePool()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  function setInitialHumanAmountIn() {
    const amountIn = {
      tokenAddress: pool.address,
      humanAmount: pool.userBalance?.walletBalance,
    } as HumanTokenAmountWithAddress

    setHumanAmountIn(amountIn)
  }

  const tokenAllowances = useTokenAllowances({
    chainId,
    userAddress,
    spenderAddress: pool.staking?.address as Address,
    tokenAddresses: [humanAmountIn?.tokenAddress as Address],
  })

  /**
   * Step construction
   */
  const { isLoadingSteps, steps } = useStakingSteps(pool, humanAmountIn)
  const transactionSteps = useTransactionSteps(steps, isLoadingSteps)

  /**
   * Side-effects
   */
  // On initial render, set the initial humanAmountsIn
  useEffect(() => {
    setInitialHumanAmountIn()
  }, [])

  return {
    transactionSteps,
    isDisabled,
    disabledReason,
    humanAmountIn,
    tokenAllowances,
  }
}
