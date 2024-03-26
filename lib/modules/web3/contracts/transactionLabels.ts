import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { TokenBase } from '../../tokens/token.types'
import { TransactionBundle } from './contract.types'

export type BuildTransactionLabels = (
  args?: any,
  transactionBundle?: TransactionBundle
) => TransactionLabels
