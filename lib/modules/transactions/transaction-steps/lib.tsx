import { TransactionBundle } from '@/lib/modules/web3/contracts/contract.types'
import React from 'react'
import { Address, Hash } from 'viem'

export enum TransactionState {
  Ready = 'init',
  Confirming = 'confirming',
  Loading = 'loading',
  Preparing = 'preparing',
  Error = 'error',
  Completed = 'completed',
}

export type TransactionLabels = {
  title?: string
  description?: string
  tooltip: string
  // State labels
  init: string
  loading?: string
  confirming?: string
  reverted?: string
  confirmed?: string
  rejected?: string
  error?: string
  preparing?: string
  poolId?: string
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
  | 'unstake'
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

export type TxCall = {
  to: Address
  data: Hash
}

/*
  Smart accounts like Gnosis safe, support batching multiple transactions into an atomic one by using wagmi's useSendCalls
  More info:
  https://wagmi.sh/react/api/hooks/useSendCalls
  https://wagmi.sh/react/api/hooks/useSendCalls
*/
type MaybeBatchableTx = {
  batchableTxCall?: TxCall
  /*
    true when the current transaction step is the last one in the batch
    Example:
    we have 3 transactions in a batch (2 token approval transactions and 1 add liquidity transaction)
    the add liquidity transaction should have isBatchEnd = true
  */
  isBatchEnd?: boolean
  renderBatchAction?: (txCalls: TxCall[]) => React.ReactNode
  // Example: token approval steps are nested inside addLiquidity step
  nestedSteps?: TransactionStep[]
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
} & MaybeBatchableTx

export function getTransactionState(transactionBundle?: TransactionBundle): TransactionState {
  if (!transactionBundle) return TransactionState.Ready
  const { simulation, execution, result } = transactionBundle

  if (simulation.isLoading || simulation.isPending) {
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
