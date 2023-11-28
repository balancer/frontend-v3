/* eslint-disable react-hooks/exhaustive-deps */
import { wETHAddress } from '@/lib/debug-helpers'
import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { MAX_BIGINT } from '@/lib/shared/hooks/useNumbers'
import { useEffect } from 'react'
import { Address } from 'viem'
import {
  TokenApprovalLabelArgs,
  buildTokenApprovalLabels,
} from '../../tokens/approvals/approval-labels'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { useActiveStep } from '../../../shared/hooks/transaction-flows/useActiveStep'
import { CompletedApprovalState } from '../../tokens/approvals/useCompletedApprovalsState'

export function useConstructApproveTokenStep(
  tokenAddress: Address,
  { completedApprovals, saveCompletedApprovals }: CompletedApprovalState
) {
  const { isActiveStep, activateStep } = useActiveStep()
  const spender = useContractAddress('balancer.vaultV2')
  const { refetchAllowances, isAllowancesLoading } = useTokenAllowances()

  const labelArgs: TokenApprovalLabelArgs = {
    actionType: 'AddLiquidity',
    // TODO: refactor when we have token info from consumer
    symbol: tokenAddress === wETHAddress ? 'WETH' : 'wjAura',
  }
  const tokenApprovalLabels = buildTokenApprovalLabels(labelArgs)

  const approvalTransaction = useManagedErc20Transaction(
    tokenAddress,
    'approve',
    tokenApprovalLabels,
    { args: [spender || emptyAddress, MAX_BIGINT] }, //By default we set MAX_BIGINT
    {
      enabled: isActiveStep && !!spender && !isAllowancesLoading,
    }
  )

  const isCompleted =
    (completedApprovals.includes(tokenAddress) && approvalTransaction.result.isSuccess) ||
    tokenAddress === emptyAddress

  const step: FlowStep = {
    ...approvalTransaction,
    transactionLabels: tokenApprovalLabels,
    id: tokenAddress,
    stepType: 'tokenApproval',
    isComplete: () => isCompleted,
    activateStep,
  }

  useEffect(() => {
    // refetch allowances after the approval transaction was executed
    async function saveExecutedApproval() {
      if (approvalTransaction.result.isSuccess) {
        await refetchAllowances()
        saveCompletedApprovals(tokenAddress)
      }
    }
    saveExecutedApproval()
  }, [approvalTransaction.result.isSuccess])

  return step
}
