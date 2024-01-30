/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useEffect } from 'react'
import { UseTokenAllowancesResponse } from '../../web3/useTokenAllowances'
import { ApprovalAction, TokenApprovalLabelArgs, buildTokenApprovalLabels } from './approval-labels'
import { useTokens } from '../useTokens'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { Address } from 'viem'
import { bn } from '@/lib/shared/utils/numbers'

export type ApproveTokenProps = {
  tokenAllowances: UseTokenAllowancesResponse
  tokenAddress: Address
  spenderAddress: Address
  amountToApprove: bigint
  actionType: ApprovalAction
  chain: GqlChain
}

export function useConstructApproveTokenStep({
  tokenAllowances,
  tokenAddress,
  spenderAddress,
  amountToApprove,
  actionType,
  chain,
}: ApproveTokenProps) {
  const { refetchAllowances, isAllowancesLoading, allowanceFor } = tokenAllowances
  const { getToken } = useTokens()

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
      enabled: !!spenderAddress && !isAllowancesLoading,
    }
  )

  /* TODO: Change props to receive a TokenAmountToApprove with:
    tokenAddress
    requiredRawAmount -> actual amount that the transaction requires
    requestedRawAmount -> amount that we are going to request (normally MAX_BIGINT)
  */
  const isComplete = bn(allowanceFor(tokenAddress)).gte(bn(amountToApprove))

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
