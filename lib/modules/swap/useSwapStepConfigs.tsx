import { useContractAddress } from '@/lib/modules/web3/contracts/useContractAddress'
import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { SwapButton } from './SwapButton'
import { useMemo } from 'react'
import { Address, parseUnits } from 'viem'
import { RawAmount } from '../tokens/approvals/approval-rules'

type Params = {
  humanAmountIn: string
  tokenIn: GqlToken | undefined
  selectedChain: GqlChain
  setSwapTxState: (transactionState: TransactionState) => void
}

export function useSwapStepConfigs({
  humanAmountIn,
  tokenIn,
  selectedChain,
  setSwapTxState,
}: Params) {
  const vaultAddress = useContractAddress('balancer.vaultV2')

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

  const swapStepConfig = {
    render: () => <SwapButton onTransactionStateUpdate={setSwapTxState} />,
  }

  const stepConfigs = [...tokenApprovalConfigs, swapStepConfig]

  return stepConfigs
}
