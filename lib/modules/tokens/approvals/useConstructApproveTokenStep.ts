/* eslint-disable react-hooks/exhaustive-deps */
import { getChainId } from '@/lib/config/app.config'
import { useManagedErc20Transaction } from '@/lib/modules/web3/contracts/useManagedErc20Transaction'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useEffect, useState } from 'react'
import { Address } from 'viem'
import { UseTokenAllowancesResponse } from '../../web3/useTokenAllowances'
import { ApprovalAction, TokenApprovalLabelArgs, buildTokenApprovalLabels } from './approval-labels'
import { TokenAmountToApprove } from './approval-rules'
import { useSyncCurrentFlowStep } from '../../transactions/transaction-steps/useCurrentFlowStep'
import { sentryMetaForWagmiSimulation } from '@/lib/shared/utils/query-errors'

export type ApproveTokenProps = {
  tokenAllowances: UseTokenAllowancesResponse
  tokenAmountToApprove: TokenAmountToApprove
  spenderAddress: Address
  actionType: ApprovalAction
  chain: GqlChain
  symbol: string
}

export function useConstructApproveTokenStep({
  tokenAllowances,
  tokenAmountToApprove,
  spenderAddress,
  actionType,
  chain,
  symbol,
}: ApproveTokenProps) {
  const { refetchAllowances, isAllowancesLoading, allowanceFor } = tokenAllowances

  const [didRefetchAllowances, setDidRefetchAllowances] = useState(false)

  const { tokenAddress, requestedRawAmount, requiredRawAmount } = tokenAmountToApprove

  const labelArgs: TokenApprovalLabelArgs = {
    actionType,
    symbol,
  }
  const tokenApprovalLabels = buildTokenApprovalLabels(labelArgs)

  const approvalTransaction = useManagedErc20Transaction(
    tokenAddress,
    'approve',
    tokenApprovalLabels,
    getChainId(chain),
    [spenderAddress, requestedRawAmount],
    {
      query: {
        enabled: !!spenderAddress && !isAllowancesLoading,
        meta: sentryMetaForWagmiSimulation(
          'Error in wagmi tx simulation: Approving token',
          tokenAmountToApprove
        ),
      },
    }
  )
  /*
     We wait for allowances to be refetched (didRefetchAllowances) after the approval transaction.
     This is must in edge-cases like USDT (with doubleApprovalRequired setup in TokensConfig) when requiredRawAmount is 0n
   */
  const isComplete = didRefetchAllowances && allowanceFor(tokenAddress) >= requiredRawAmount

  const step = useSyncCurrentFlowStep({
    ...approvalTransaction,
    transactionLabels: tokenApprovalLabels,
    id: tokenAddress,
    stepType: 'tokenApproval',
    isComplete: () => isComplete,
  })

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
