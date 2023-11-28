import { TransactionBundle } from '@/lib/modules/web3/contracts/contract.types'

export enum TransactionState {
  Ready = 'init',
  Confirming = 'confirming',
  Loading = 'loading',
  Preparing = 'preparing',
  Error = 'error',
}

export type TransactionLabels = {
  init: string
  loading?: string
  confirming?: string
  tooltip: string
  description?: string
  reverted?: string
  confirmed?: string
  rejected?: string
  error?: string
  preparing?: string
}

type StepType = 'batchRelayerApproval' | 'tokenApproval' | 'joinPool'

export type ManagedResult = TransactionBundle & Executable

/* This type unifies wagmi writeTransaction and sendTransaction types:
  execute is the union of write and sendTransaction functions
  executeAsync is the union of writeAsync and sendTransactionAsync functions
*/
type Executable = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  execute?: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  executeAsync?: Function
  setTxConfig?: any
}

export type FlowStep = TransactionStep & ManagedResult

export type TransactionStep = {
  id: string
  stepType: StepType
  getLabels: (args?: any) => TransactionLabels
  isComplete: () => boolean
  activateStep: () => void
}

// Allows adding extra properties like set state callbacks to TransactionStep
export type TransactionStepHook = {
  transactionStep: TransactionStep
}

export function getTransactionState({
  simulation,
  execution,
  result,
}: TransactionBundle): TransactionState {
  if (simulation.isLoading) {
    return TransactionState.Preparing
  }
  if (execution.isLoading) {
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
