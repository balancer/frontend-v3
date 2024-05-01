import { CoreStepId, TransactionState } from './lib'
import { useTransactionFlow } from './TransactionFlowProvider'

export function useShouldFreezeQuote(stepId: CoreStepId) {
  const { getCoreTransactionState } = useTransactionFlow()

  const coreTxState = getCoreTransactionState(stepId)
  const isConfirming = coreTxState === TransactionState.Confirming
  const isAwaitingUserConfirmation = coreTxState === TransactionState.Loading
  const isComplete = coreTxState === TransactionState.Completed
  const isError = coreTxState === TransactionState.Error

  // Disable query refetches:
  // if the flow is complete
  // if the core transaction is confirming
  const shouldFreezeQuote = isComplete || isConfirming || isAwaitingUserConfirmation || isError
  return { shouldFreezeQuote }
}
