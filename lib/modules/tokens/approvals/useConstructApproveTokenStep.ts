/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useEffect } from 'react'
import { UseTokenAllowancesResponse } from '../../web3/useTokenAllowances'
import { ApprovalAction, TokenApprovalLabelArgs, buildTokenApprovalLabels } from './approval-labels'
import { useTokens } from '../useTokens'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'viem'
import { TokenAmountToApprove } from './approval-rules'
import { TransactionBundle } from '../../web3/contracts/contract.types'

export type ApproveTokenProps = {
  tokenAllowances: UseTokenAllowancesResponse
  tokenAmountToApprove: TokenAmountToApprove
  spenderAddress: Address
  actionType: ApprovalAction
  chain: GqlChain
}

export function useConstructApproveTokenStep({
  tokenAllowances,
  tokenAmountToApprove,
  spenderAddress,
  actionType,
  chain,
}: ApproveTokenProps) {
  const { refetchAllowances, isAllowancesLoading, allowanceFor } = tokenAllowances
  const { getToken } = useTokens()

  const { tokenAddress, requestedRawAmount, requiredRawAmount } = tokenAmountToApprove

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
    { args: [spenderAddress, requestedRawAmount] },
    {
      enabled: !!spenderAddress && !isAllowancesLoading,
    }
  )

  const isComplete = isStepComplete(
    allowanceFor(tokenAddress),
    requiredRawAmount,
    approvalTransaction
  )

  const step: FlowStep = {
    ...approvalTransaction,
    transactionLabels: tokenApprovalLabels,
    id: tokenAddress,
    stepType: 'tokenApproval',
    isComplete: () => isComplete,
  }

  useEffect(() => {
    // refetch allowances after the approval transaction was executed
    async function saveExecutedApproval() {
      if (approvalTransaction.result.isSuccess) {
        await refetchAllowances()
      }
    }
    saveExecutedApproval()
  }, [approvalTransaction.result.isSuccess])

  return step
}

function isStepComplete(
  currentAllowance: bigint,
  requiredRawAmount: bigint,
  approvalTransaction: TransactionBundle
): boolean {
  /* When we are approving 0n for edge-cases like USDT (with doubleApprovalRequired setup in TokensConfig)
     we only wait for the on approval transaction to be successful
   */
  if (requiredRawAmount === 0n) return approvalTransaction.result.isSuccess

  return currentAllowance >= requiredRawAmount
}
