import { ManagedTransactionPayload } from '@/lib/contracts/contract.types'

export enum TransactionState {
  Ready = 'ready',
  Confirming = 'confirming',
  Loading = 'loading',
  Error = 'error',
}

export type TransactionLabels = {
  ready: string
  loading?: string
  confirming?: string
  tooltip: string
  description: string
}

type StepId = 'batchRelayerApproval' | 'tokenApproval'

export type TransactionStep = {
  stepId: StepId
  getLabels: (args?: any) => TransactionLabels
  isComplete: boolean
} & ManagedTransactionPayload

// Allows adding extra properties like set state callbacks to TransactionStep
export type TransactionStepHook = {
  transactionStep: TransactionStep
}

export function getTransactionState({
  simulation,
  execution,
  result,
}: ManagedTransactionPayload): TransactionState {
  if (execution.isLoading || simulation.isLoading) {
    return TransactionState.Loading
  }
  if (result.isLoading) {
    return TransactionState.Confirming
  }
  if (!simulation.isError && !execution.isError && !execution.data) {
    return TransactionState.Ready
  }
  if (simulation.isError || execution.isError) {
    return TransactionState.Error
  }
  return TransactionState.Ready
}
