import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { TransactionState } from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { SwapButton } from './SwapButton'
import { useMemo } from 'react'
import { Address, parseUnits } from 'viem'
import { RawAmount } from '../tokens/approvals/approval-rules'
import { StepConfig } from '../transactions/transaction-steps/useIterateSteps'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { getNetworkConfig } from '@/lib/config/app.config'

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
  const {
    tokens: { nativeAsset },
  } = getNetworkConfig(selectedChain)

  const tokenInAmounts = useMemo(() => {
    if (!tokenIn) return [] as RawAmount[]
    if (isSameAddress(tokenIn.address, nativeAsset.address)) return []

    return [
      {
        address: tokenIn.address as Address,
        rawAmount: parseUnits(humanAmountIn, tokenIn.decimals),
      },
    ]
  }, [humanAmountIn, tokenIn, nativeAsset])

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
