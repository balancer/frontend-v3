import { useMemo } from 'react'
import { Address, parseUnits } from 'viem'
import { ApprovalAction } from '../tokens/approvals/approval-labels'
import { RawAmount } from '../tokens/approvals/approval-rules'
import { useTokenApprovalSteps } from '../tokens/approvals/useTokenApprovalSteps'
import { OSwapAction } from './swap.types'
import { SwapStepParams, useSwapStep } from './useSwapStep'

type Params = SwapStepParams & {
  vaultAddress: Address
}

export function useSwapSteps({
  swapState,
  vaultAddress,
  handler,
  isNativeAssetIn,
  simulationQuery,
  swapAction,
  tokenInInfo,
  tokenOutInfo,
}: Params) {
  const humanAmountIn = swapState.tokenIn.amount
  const tokenInAmounts = useMemo(() => {
    if (!tokenInInfo) return [] as RawAmount[]
    return [
      {
        address: tokenInInfo.address as Address,
        rawAmount: parseUnits(humanAmountIn, tokenInInfo.decimals),
      },
    ]
  }, [humanAmountIn, tokenInInfo])

  const approvalActionType: ApprovalAction =
    swapAction === OSwapAction.UNWRAP ? 'Unwrapping' : 'Swapping'

  const { isLoading: isLoadingTokenApprovalSteps, steps: tokenApprovalSteps } =
    useTokenApprovalSteps({
      spenderAddress: vaultAddress,
      chain: swapState.selectedChain,
      approvalAmounts: tokenInAmounts,
      actionType: approvalActionType,
    })

  const swapStep = useSwapStep({
    handler,
    isNativeAssetIn,
    swapState,
    simulationQuery,
    swapAction,
    tokenInInfo,
    tokenOutInfo,
  })

  const steps = [...tokenApprovalSteps, swapStep]

  return {
    isLoadingSteps: isLoadingTokenApprovalSteps,
    steps,
  }
}
