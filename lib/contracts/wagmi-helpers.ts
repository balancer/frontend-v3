// Helpers for wagmi transactions
import { Address } from 'wagmi'
import { TransactionBundle } from './contract.types'

export function getHashFromTransaction(transactionBundle?: TransactionBundle): Address | undefined {
  if (!transactionBundle) return
  if (transactionBundle.execution) return transactionBundle.execution.data?.hash
}

export const noUserAddress = '0xNoUser' // We use this value to avoid TS inference problems in wagmi hooks
