import { Address, parseUnits } from 'viem'
import { Pool } from '../../usePool'
import { useTokenApprovalSteps } from '@/lib/modules/tokens/approvals/useTokenApprovalSteps'
import { RawAmount } from '@/lib/modules/tokens/approvals/approval-rules'
import { BPT_DECIMALS } from '../../pool.constants'
import { HumanAmountIn } from '../liquidity-types'
import { useMemo } from 'react'
import { useStakingStep } from './useStakingStep'

export function useStakingSteps(pool: Pool, humanAmountToApprove: HumanAmountIn | null) {
  const rawAmount = parseUnits(humanAmountToApprove?.humanAmount || '', BPT_DECIMALS)

  const amountToApprove: RawAmount = {
    rawAmount,
    address: pool.address as Address,
  }
  const { isLoading: isLoadingTokenApprovalSteps, steps: tokenApprovalSteps } =
    useTokenApprovalSteps({
      spenderAddress: pool.staking?.address as Address,
      chain: pool.chain,
      approvalAmounts: [amountToApprove],
      actionType: 'Staking',
      bptSymbol: pool.symbol,
    })

  const stakingStep = useStakingStep(pool, rawAmount)

  const steps = useMemo(
    () => [...tokenApprovalSteps, stakingStep],
    [tokenApprovalSteps, stakingStep]
  )

  return {
    isLoadingSteps: isLoadingTokenApprovalSteps,
    steps,
  }
}
