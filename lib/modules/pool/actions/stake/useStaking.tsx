/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { makeVar, useReactiveVar } from '@apollo/client'
import { HumanAmountIn } from '../liquidity-types'
import { Address, parseUnits } from 'viem'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { usePool } from '../../usePool'
import { BPT_DECIMALS } from '../../pool.constants'
import { useEffect } from 'react'

export const humanAmountInVar = makeVar<HumanAmountIn | null>(null)

export function useStaking() {
  const { userAddress, isConnected } = useUserAccount()
  const { pool } = usePool()
  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const humanAmountIn = useReactiveVar(humanAmountInVar)

  function setInitialHumanAmountIn() {
    const amountIn = {
      tokenAddress: pool.address,
      humanAmount: pool.userBalance?.walletBalance,
    } as HumanAmountIn

    humanAmountInVar(amountIn)
  }

  const tokenAllowances = useTokenAllowances(
    userAddress,
    pool.staking?.gauge?.gaugeAddress as Address,
    [humanAmountIn?.tokenAddress as Address]
  )

  const rawAmount = parseUnits(humanAmountIn?.humanAmount || '', BPT_DECIMALS)

  const amountToApprove = {
    rawAmount,
    address: pool.address as Address,
  }

  /**
   * Side-effects
   */
  // On initial render, set the initial humanAmountsIn
  useEffect(() => {
    setInitialHumanAmountIn()
  }, [])

  return {
    isDisabled,
    disabledReason,
    humanAmountIn,
    rawAmount,
    tokenAllowances,
    amountToApprove,
  }
}
