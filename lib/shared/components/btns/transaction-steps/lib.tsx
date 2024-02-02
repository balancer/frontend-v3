import { TransactionBundle } from '@/lib/modules/web3/contracts/contract.types'

export enum TransactionState {
  Ready = 'init',
  Confirming = 'confirming',
  Loading = 'loading',
  Preparing = 'preparing',
  Error = 'error',
  Completed = 'completed',
}

export type OnTransactionStateUpdate = (transactionState: TransactionState) => void

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

export type StepType =
  | 'signBatchRelayer'
  | 'approveBatchRelayer'
  | 'tokenApproval'
  | 'addLiquidity'
  | 'removeLiquidity'
  | 'gaugeDeposit'
  | 'gaugeWithdraw'

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
  transactionLabels: TransactionLabels
  isComplete: () => boolean
}

// Allows adding extra properties like set state callbacks to TransactionStep
export type TransactionStepHook = {
  transactionStep: TransactionStep
}

export function getTransactionState(transactionBundle?: TransactionBundle): TransactionState {
  if (!transactionBundle) return TransactionState.Ready
  const { simulation, execution, result } = transactionBundle

  if (simulation.isLoading) {
    return TransactionState.Preparing
  }
  if (execution.isLoading) {
    return TransactionState.Loading
  }
  if (execution.isSuccess) {
    return TransactionState.Completed
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
