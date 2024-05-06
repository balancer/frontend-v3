import {
  ManagedSendTransactionInput,
  useManagedSendTransaction,
} from '../../web3/contracts/useManagedSendTransaction'
import { ManagedResult, TransactionLabels } from './lib'
import { TransactionStepButton } from './TransactionStepButton'

export function ManagedTransactionButton() {}

export function ManagedSendTransactionButton({
  setTransaction,
  ...params
}: ManagedSendTransactionInput & { setTransaction: (tx: ManagedResult) => void }) {
  const transaction = useManagedSendTransaction(params)

  setTransaction(transaction)

  return <TransactionStepButton step={{ labels: params.labels, ...transaction }} />
}

export function ManagedErc20TransactionButton() {}
