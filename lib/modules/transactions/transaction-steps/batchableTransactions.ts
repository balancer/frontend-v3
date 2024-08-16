/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { SafeAppTxCall, TransactionStep, TxCall } from './lib'

export function buildTxBatch(transactionStep: TransactionStep): SafeAppTxCall[] {
  if (!transactionStep.nestedSteps) throw new Error('No nested steps')
  return [
    ...transactionStep.nestedSteps
      // Comment the following line to test a batch when tokens are already allowed
      // .filter(step => !step.isComplete())
      .map(step => {
        return buildSafeTxCall(step.batchableTxCall!)
      }),
    buildSafeTxCall(transactionStep.batchableTxCall!),
  ]
}

function buildSafeTxCall(txCall: TxCall): SafeAppTxCall {
  return { ...txCall, value: '0' }
}
