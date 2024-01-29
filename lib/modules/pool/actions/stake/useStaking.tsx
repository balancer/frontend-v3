/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { HumanAmount } from '@balancer/sdk'
import { PropsWithChildren, createContext } from 'react'
import { Address, parseUnits } from 'viem'
import { usePool } from '../../usePool'
import { isDisabledWithReason } from '@/lib/shared/utils/functions/isDisabledWithReason'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { LABELS } from '@/lib/shared/labels'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useActiveStep } from '@/lib/shared/hooks/transaction-flows/useActiveStep'
import { useNextTokenApprovalStep } from '@/lib/modules/tokens/approvals/useNextTokenApprovalStep'
import { useTokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { useConstructGaugeDepositActionStep } from '@/lib/modules/gauge/gauge.actions'
import { BPT_DECIMALS } from '../../pool.constants'

export type UseStakingResponse = ReturnType<typeof _useStaking>

export const StakingContext = createContext<UseStakingResponse | null>(null)

export function _useStaking() {
  const {
    isActiveStep: isFinalStepActive,
    activateStep: activateFinalStep,
    deactivateStep: deactivateFinalStep,
  } = useActiveStep()
  const { pool } = usePool()
  const { isConnected, userAddress } = useUserAccount()

  const { isDisabled, disabledReason } = isDisabledWithReason([
    !isConnected,
    LABELS.walletNotConnected,
  ])

  const unstakedBalance = pool.userBalance?.walletBalance || '0'
  const gaugeAddress = pool.staking?.address as Address
  const poolAddress = pool.address as Address

  // Get token allowances
  const tokenAllowances = useTokenAllowances(userAddress, gaugeAddress, [poolAddress])

  console.log({ tokenAllowances })

  // Construct token allowance step
  const amountToApprove = {
    rawAmount: parseUnits(unstakedBalance, BPT_DECIMALS),
    humanAmount: unstakedBalance as HumanAmount,
    tokenAddress: poolAddress,
    tokenSymbol: pool.symbol,
  }
  const { tokenApprovalStep, remainingAmountsToApprove } = useNextTokenApprovalStep({
    tokenAllowances,
    amountsToApprove: [amountToApprove],
    actionType: 'Staking',
  })

  /**
   * Transaction step construction
   */
  const stakeStep = useConstructGaugeDepositActionStep(
    pool.staking?.gauge,
    amountToApprove.rawAmount
  )

  const steps = [tokenApprovalStep, stakeStep].filter(step => step !== null) as FlowStep[]

  return {
    isDisabled,
    disabledReason,
    remainingAmountsToApprove,
    tokenApprovalStep,
    steps,
    isFinalStepActive,
    deactivateFinalStep,
  }
}

export function StakingProvider({ children }: PropsWithChildren) {
  const hook = _useStaking()
  return <StakingContext.Provider value={hook}>{children}</StakingContext.Provider>
}

export const useStaking = (): UseStakingResponse => useMandatoryContext(StakingContext, 'Staking')
