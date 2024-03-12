import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { TransactionState } from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { SwapButton } from './SwapButton'
import { useMemo } from 'react'
import { Address, parseUnits } from 'viem'
import { RawAmount } from '../tokens/approvals/approval-rules'
import { StepConfig } from '../transactions/transaction-steps/useIterateSteps'

type Params = {
  humanAmountIn: string
  tokenIn: GqlToken | undefined
  selectedChain: GqlChain
  vaultAddress: Address
  setSwapTxState: (transactionState: TransactionState) => void
}

export function useSwapStepConfigs({
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

  const tokenApprovalConfigs = useTokenApprovalConfigs({
    spenderAddress: vaultAddress,
    chain: selectedChain,
    approvalAmounts: tokenInAmounts,
    actionType: 'Swapping',
  })

  const swapStepConfig: StepConfig = {
    title: 'Swap',
    render: () => <SwapButton onTransactionStateUpdate={setSwapTxState} />,
  }

  return [...tokenApprovalConfigs, swapStepConfig]
}
