import { useEffect } from 'react'
import { TransactionBundle } from './contract.types'
import { getHashFromTransaction } from './wagmi-helpers'
import { useRecentTransactions } from '@/lib/modules/transactions/RecentTransactionsProvider'

export function useOnNewTxHash(transactionBundle: TransactionBundle) {
  const { addTransaction } = useRecentTransactions()
  useEffect(
    () => {
      if (getHashFromTransaction(transactionBundle)) {
        console.log('NEW TRANSACTION HASH!', getHashFromTransaction(transactionBundle))
        addTransaction(transactionBundle)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getHashFromTransaction(transactionBundle)]
  )
}
