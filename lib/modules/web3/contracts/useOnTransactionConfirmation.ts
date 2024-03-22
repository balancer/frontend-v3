import { useEffect } from 'react'
import { Address } from 'viem'
import { useRecentTransactions } from '../../transactions/RecentTransactionsProvider'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'

type updateTrackedTransactionRequest = {
  labels: TransactionLabels
  status?: 'success' | 'reverted'
  hash?: Address
}

export function useOnTransactionConfirmation({
  labels,
  hash,
  status,
}: updateTrackedTransactionRequest) {
  const { updateTrackedTransaction } = useRecentTransactions()

  // on confirmation, update tx in tx cache
  useEffect(() => {
    if (hash) {
      if (status === 'reverted') {
        updateTrackedTransaction(hash, {
          label: labels.reverted,
          status: 'reverted',
        })
      } else {
        updateTrackedTransaction(hash, {
          label: labels.confirmed,
          status: 'confirmed',
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])
}
