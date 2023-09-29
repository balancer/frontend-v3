import { useEffect } from 'react'
import { TransactionInfo } from './contracts.types'
import { getHash } from './wagmi-helpers'
import { useRecentTransactions } from '@/lib/modules/transactions/RecentTransactionsProvider'

export function useOnNewTxHash(transactionInfo: TransactionInfo) {
  const { addTransaction } = useRecentTransactions()
  useEffect(
    () => {
      if (getHash(transactionInfo)) {
        console.log('NEW TRANSACTION HASH!', getHash(transactionInfo))
        addTransaction(transactionInfo)
      }
    },
    // TODO: This is wrong: we will improve it soon
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transactionInfo.execution.data?.hash]
  )
}
