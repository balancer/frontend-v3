import { TransactionBundle } from '@/lib/modules/web3/contracts/contract.types'
import React from 'react'

export enum TransactionState {
  Ready = 'init',
  Confirming = 'confirming',
  Loading = 'loading',
  Preparing = 'preparing',
  Error = 'error',
  Completed = 'completed',
}

export type TransactionLabels = {
  init: string
  title?: string
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
  | 'stakingDeposit'
  | 'stakingWithdraw'
  | 'minterApproval'
  | 'claimAndUnstake'
  | 'claim'
  | 'swap'

export type TxActionId =
  | 'SignBatchRelayer'
  | 'ApproveBatchRelayer'
  | 'TokenApproval'
  | 'AddLiquidity'
  | 'RemoveLiquidity'
  | 'StakingDeposit'
  | 'StakingWithdraw'
  | 'MinterApproval'
  | 'ClaimAndUnstake'
  | 'Claim'
  | 'Swap'

export type ManagedResult = TransactionBundle & Executable

/* This type unifies wagmi writeTransaction and sendTransaction types:
  execute is the union of write and sendTransaction functions
  executeAsync is the union of writeAsync and sendTransactionAsync functions
*/
type Executable = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  executeAsync?: Function
  setTxConfig?: any
}

export type TransactionStep = {
  id: string
  stepType: StepType
  labels: TransactionLabels
  isComplete: () => boolean
  renderAction: () => React.ReactNode
  // All callbacks should be idempotent
  onSuccess?: () => void
  onActivated?: () => void
  onDeactivated?: () => void
  // Testing purposes
  _props?: any
}

export function getTransactionState(transactionBundle?: TransactionBundle): TransactionState {
  if (!transactionBundle) return TransactionState.Ready
  const { simulation, execution, result } = transactionBundle

  if (simulation.isLoading) {
    return TransactionState.Preparing
  }
  if (execution.isPending) {
    return TransactionState.Loading
  }
  if (result.isSuccess) {
    return TransactionState.Completed
  }
  if (result.isLoading) {
    return TransactionState.Confirming
  }
  if (!simulation.isError && !execution.isError && !execution.data) {
    return TransactionState.Ready
  }
  if (simulation.isError || execution.isError || result.isError) {
    return TransactionState.Error
  }
  return TransactionState.Ready
}
