'use client'

import {
  ManagedErc20TransactionInput,
  useManagedErc20Transaction,
} from '../../web3/contracts/useManagedErc20Transaction'
import {
  ManagedSendTransactionInput,
  useManagedSendTransaction,
} from '../../web3/contracts/useManagedSendTransaction'
import {
  ManagedTransactionInput,
  useManagedTransaction,
} from '../../web3/contracts/useManagedTransaction'
import { TransactionStepButton } from './TransactionStepButton'
import { useTransactionSteps } from './TransactionStepsProvider'

export function ManagedTransactionButton({
  id,
  ...params
}: { id: string } & ManagedTransactionInput) {
  const transaction = useManagedTransaction(params)
  const { updateTransactionMap } = useTransactionSteps()

  updateTransactionMap(id, transaction)

  return <TransactionStepButton step={{ labels: params.labels, ...transaction }} />
}

export function ManagedSendTransactionButton({
  id,
  ...params
}: { id: string } & ManagedSendTransactionInput) {
  const transaction = useManagedSendTransaction(params)
  const { updateTransactionMap } = useTransactionSteps()

  updateTransactionMap(id, transaction)

  return <TransactionStepButton step={{ labels: params.labels, ...transaction }} />
}

export function ManagedErc20TransactionButton({
  id,
  ...params
}: { id: string } & ManagedErc20TransactionInput) {
  const transaction = useManagedErc20Transaction(params)
  const { updateTransactionMap } = useTransactionSteps()

  updateTransactionMap(id, transaction)

  return <TransactionStepButton step={{ labels: params.labels, ...transaction }} />
}