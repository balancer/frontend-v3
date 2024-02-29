import { useTokenApprovalConfigs } from '@/lib/modules/tokens/approvals/useTokenApprovalConfigs'
import { TransactionState } from '@/lib/shared/components/btns/transaction-steps/lib'
import { GqlChain, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { SwapButton } from './SwapButton'
import { useMemo } from 'react'
import { Address, parseUnits } from 'viem'
import { RawAmount } from '../tokens/approvals/approval-rules'
import { VaultVersion } from '@/lib/shared/types'
import { useVault } from '@/lib/shared/hooks/useVault'

type Params = {
  humanAmountIn: string
  tokenIn: GqlToken | undefined
  selectedChain: GqlChain
  vaultVersion: VaultVersion
  setSwapTxState: (transactionState: TransactionState) => void
}

export function useSwapStepConfigs({
  humanAmountIn,
  tokenIn,
  selectedChain,
  vaultVersion = 2,
  setSwapTxState,
}: Params) {
  const { vaultAddress } = useVault(vaultVersion)

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

  return [...tokenApprovalConfigs, swapStepConfig]
}
