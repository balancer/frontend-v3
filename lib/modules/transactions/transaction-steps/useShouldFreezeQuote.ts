import { CoreStepId, TransactionState } from './lib'
import { useCurrentFlowStep } from './useCurrentFlowStep'

export function useShouldFreezeQuote(stepId: CoreStepId) {
  const { getCoreTransactionState } = useCurrentFlowStep()

  const addLiquidityTxState = getCoreTransactionState(stepId)
  const isConfirmingAddLiquidity = addLiquidityTxState === TransactionState.Confirming
  const isAwaitingUserConfirmation = addLiquidityTxState === TransactionState.Loading
  const isComplete = addLiquidityTxState === TransactionState.Completed

  // Disable query refetches:
  // if the flow is complete
  // if the core transaction is confirming
  const shouldFreezeQuote = isComplete || isConfirmingAddLiquidity || isAwaitingUserConfirmation
  return { shouldFreezeQuote }
}
