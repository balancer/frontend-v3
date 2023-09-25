import { useEffect } from 'react'
import { TransactionInfo } from './contracts.types'
import { getHash } from './wagmi-helpers'
import { useTransactions } from '@/lib/modules/transactions/TransactionsProvider'

export function useOnNewTxHash(transactionInfo: TransactionInfo) {
  const { addTransaction } = useTransactions()
  useEffect(
    () => {
      if (getHash(transactionInfo)) {
        console.log('NEW TRANSACTION HASH!', getHash(transactionInfo))
        addTransaction(transactionInfo)
      }
    },
    // QUESTION: How do we avoid this?
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getHash(transactionInfo)]
  )
}
