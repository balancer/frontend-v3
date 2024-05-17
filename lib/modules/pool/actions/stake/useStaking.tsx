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
import { useStakingSteps } from './useStakingSteps'
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'

export type UseStakingResponse = ReturnType<typeof _useStaking>
export const StakeContext = createContext<UseStakingResponse | null>(null)

export function _useStaking() {
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

  const stakeTxHash = transactionSteps.lastTransaction?.result?.data?.transactionHash

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
    stakeTxHash,
    isLoading: isLoadingSteps,
  }
}

export function StakingProvider({ children }: PropsWithChildren) {
  const hook = _useStaking()
  return <StakeContext.Provider value={hook}>{children}</StakeContext.Provider>
}

export const useStaking = (): UseStakingResponse => useMandatoryContext(StakeContext, 'Stake')
