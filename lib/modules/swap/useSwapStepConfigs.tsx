import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { TransactionState } from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { SwapButton } from './SwapButton'
import { useMemo } from 'react'
import { Address, parseUnits } from 'viem'
import { RawAmount } from '../tokens/approvals/approval-rules'
import { StepConfig } from '../transactions/transaction-steps/useIterateSteps'
import { OSwapAction, SwapAction } from './swap.types'
import { capitalize } from 'lodash'
import { ApprovalAction } from '../tokens/approvals/approval-labels'

type Params = {
  action: SwapAction
  humanAmountIn: string
  tokenIn: GqlToken | undefined
  selectedChain: GqlChain
  vaultAddress: Address
  setSwapTxState: (transactionState: TransactionState) => void
}

export function useSwapStepConfigs({
  action,
  humanAmountIn,
  tokenIn,
  selectedChain,
  vaultAddress,
  setSwapTxState,
}: Params) {
  const tokenInAmounts = useMemo(() => {
    if (!tokenIn) return [] as RawAmount[]
    return [
      {
        address: tokenIn.address as Address,
        rawAmount: parseUnits(humanAmountIn, tokenIn.decimals),
      },
    ]
  }, [humanAmountIn, tokenIn])

  const approvalActionType: ApprovalAction =
    action === OSwapAction.UNWRAP ? 'Unwrapping' : 'Swapping'

  const tokenApprovalConfigs = useTokenApprovalConfigs({
    spenderAddress: vaultAddress,
    chain: selectedChain,
    approvalAmounts: tokenInAmounts,
    actionType: approvalActionType,
  })

  const swapStepConfig: StepConfig = {
    title: capitalize(action),
    render: () => <SwapButton onTransactionStateUpdate={setSwapTxState} />,
  }

  return [...tokenApprovalConfigs, swapStepConfig]
}
