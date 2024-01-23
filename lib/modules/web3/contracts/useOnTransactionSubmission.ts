import { useEffect } from 'react'
import { Address } from 'viem'
import { useRecentTransactions } from '../../transactions/RecentTransactionsProvider'
import { TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'

export function useOnTransactionSubmission(labels: TransactionLabels, hash?: Address) {
  const { addTrackedTransaction } = useRecentTransactions()

  // on successful submission to chain, add tx to cache
  useEffect(() => {
    if (hash) {
      addTrackedTransaction({
        hash,
        label: labels.confirming || 'Confirming transaction',
        description: labels.description,
        status: 'confirming',
        timestamp: Date.now(),
        init: labels.init,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])
}
