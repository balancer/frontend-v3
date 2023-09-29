// Helpers for wagmi transactions
import { Address } from 'wagmi'
import { TransactionInfo } from './contracts.types'

export function getHash(transaction?: TransactionInfo): Address | undefined {
  if (!transaction) return
  if (transaction.execution) return transaction.execution.data?.hash
}

export const noUserAddress = '0xNoUser' // We use this value to avoid TS inference problems in wagmi hooks
