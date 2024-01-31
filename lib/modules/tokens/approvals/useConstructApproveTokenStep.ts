/* eslint-disable react-hooks/exhaustive-deps */
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { FlowStep } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useEffect, useState } from 'react'
import { UseTokenAllowancesResponse } from '../../web3/useTokenAllowances'
import { ApprovalAction, TokenApprovalLabelArgs, buildTokenApprovalLabels } from './approval-labels'
import { Address } from 'viem'
import { useTokens } from '../useTokens'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { TokenAmountToApprove } from './approval-rules'

export type ApproveTokenProps = {
  tokenAllowances: UseTokenAllowancesResponse
  tokenAmountToApprove: TokenAmountToApprove
  spenderAddress: Address
  actionType: ApprovalAction
}

export function useConstructApproveTokenStep({
  tokenAllowances,
  tokenAmountToApprove,
  spenderAddress,
  actionType,
}: ApproveTokenProps) {
  const { refetchAllowances, isAllowancesLoading, allowanceFor } = tokenAllowances
  const { getToken } = useTokens()
  const { chain } = useNetworkConfig()

  const [didRefetchAllowances, setDidRefetchAllowances] = useState(false)

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
  /*
     We wait for allowances to be refetched (didRefetchAllowances) after the approval transaction.
     This is must in edge-cases like USDT (with doubleApprovalRequired setup in TokensConfig) when requiredRawAmount is 0n
   */
  const isComplete = didRefetchAllowances && allowanceFor(tokenAddress) >= requiredRawAmount

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
        setDidRefetchAllowances(true)
      }
    }
    saveExecutedApproval()
  }, [approvalTransaction.result.isSuccess])

  return step
}
