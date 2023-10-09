import { useEffect } from 'react'
import { TransactionInfo } from './contract.types'
import { getHashFromTransaction } from './wagmi-helpers'
import { useRecentTransactions } from '@/lib/modules/transactions/RecentTransactionsProvider'

export function useOnNewTxHash(transactionInfo: TransactionInfo) {
  const { addTransaction } = useRecentTransactions()
  useEffect(
    () => {
      if (getHashFromTransaction(transactionInfo)) {
        console.log('NEW TRANSACTION HASH!', getHashFromTransaction(transactionInfo))
        addTransaction(transactionInfo)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getHashFromTransaction(transactionInfo)]
  )
}
