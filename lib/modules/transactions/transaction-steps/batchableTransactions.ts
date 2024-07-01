/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TransactionStep, TxCall } from './lib'

export function buildTxBatch(transactionStep: TransactionStep): TxCall[] {
  if (!transactionStep.nestedSteps) throw new Error('No nested steps')
  return [
    ...transactionStep.nestedSteps.map(step => step.batchableTxCall!),
    transactionStep.batchableTxCall!,
  ]
}
