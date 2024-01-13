/* eslint-disable react-hooks/exhaustive-deps */
import { ContractPath, useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { emptyAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useEffect } from 'react'
import { MAX_BIGINT } from '@/lib/shared/utils/numbers'
import { CompletedApprovalState } from './useCompletedApprovalsState'
import { useActiveStep } from '@/lib/shared/hooks/transaction-flows/useActiveStep'
import { useTokenAllowances } from '../../web3/useTokenAllowances'
import { ApprovalAction, TokenApprovalLabelArgs, buildTokenApprovalLabels } from './approval-labels'
import { useTokens } from '../useTokens'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'viem'

type Params = {
  tokenAddress: Address
  spender?: ContractPath
  amountToApprove: bigint
  actionType: ApprovalAction
  chain: GqlChain
  completedApprovalState: CompletedApprovalState
}

export function useConstructApproveTokenStep({
  tokenAddress,
  spender = 'balancer.vaultV2',
  amountToApprove = MAX_BIGINT,
  actionType,
  chain,
  completedApprovalState,
}: Params) {
  const { isActiveStep, activateStep } = useActiveStep()
  const spenderAddress = useContractAddress(spender)
  const { refetchAllowances, isAllowancesLoading } = useTokenAllowances()
  const { getToken } = useTokens()
  const { completedApprovals, saveCompletedApprovals } = completedApprovalState

  const token = getToken(tokenAddress, chain)

  const labelArgs: TokenApprovalLabelArgs = {
    actionType,
    symbol: token ? token.symbol : 'Unknown',
  }
  const tokenApprovalLabels = buildTokenApprovalLabels(labelArgs)

  const approvalTransaction = useManagedErc20Transaction(
    tokenAddress,
    'approve',
    tokenApprovalLabels,
    { args: [spenderAddress, amountToApprove] },
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
