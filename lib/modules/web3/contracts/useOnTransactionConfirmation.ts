import { useEffect } from 'react'
import { Address } from 'viem'
import { useRecentTransactions } from '../../transactions/RecentTransactionsProvider'
import { TransactionLabels } from '@/components/btns/transaction-steps/lib'

export function useOnTransactionConfirmation(
  labels: TransactionLabels,
  transactionStatus?: 'success' | 'reverted',
  transactionHash?: Address
) {
  const { updateTrackedTransaction } = useRecentTransactions()

  // on confirmation, update tx in tx cache
  useEffect(() => {
    if (transactionHash) {
      if (transactionStatus === 'reverted') {
        updateTrackedTransaction(transactionHash, {
          label: labels.reverted,
          status: 'reverted',
        })
      } else {
        updateTrackedTransaction(transactionHash, {
          label: labels.confirmed,
          status: 'confirmed',
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionHash])
}
