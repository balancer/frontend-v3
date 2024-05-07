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
  transactionLabels: TransactionLabels
  isComplete: () => boolean
}

export type FlowStep = TransactionStep & ManagedResult

export type TransactionStep2 = {
  id: string
  stepType: StepType
  labels: TransactionLabels
  isComplete: () => boolean
  renderAction: () => React.ReactNode
  onSuccess?: () => void
}

// Allows adding extra properties like set state callbacks to TransactionStep
export type TransactionStepHook = {
  transactionStep: TransactionStep
}

// Core steps that require frozen quotes
export const addLiquidityStepId = 'addLiquidityId'
export const removeLiquidityStepId = 'removeLiquidityId'
export const swapStepId = 'swapId'

export function isCoreStep(stepId?: string) {
  if (!stepId) return false
  const coreSteps = new Set([addLiquidityStepId, removeLiquidityStepId, swapStepId])
  return coreSteps.has(stepId)
}

export type CoreStepId =
  | typeof addLiquidityStepId
  | typeof removeLiquidityStepId
  | typeof swapStepId

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
