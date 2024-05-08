import { useTransactionMap } from './TransactionMapProvider'
import { getTransactionState, TransactionState } from './lib'

export function useShouldFreezeQuote(stepId: string) {
  const { getTransaction } = useTransactionMap()

  const transaction = getTransaction(stepId)
  const transactionState = getTransactionState(transaction)

  const isConfirming = transactionState === TransactionState.Confirming
  const isAwaitingUserConfirmation = transactionState === TransactionState.Loading
  const isComplete = transactionState === TransactionState.Completed
  const isError = transactionState === TransactionState.Error

  // Disable query refetches:
  // if the flow is complete
  // if the core transaction is confirming
  const shouldFreezeQuote = isComplete || isConfirming || isAwaitingUserConfirmation || isError

  return { shouldFreezeQuote }
}
