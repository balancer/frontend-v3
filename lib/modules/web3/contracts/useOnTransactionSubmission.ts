import { useEffect } from 'react'
import { Address } from 'viem'
import { useRecentTransactions } from '../../transactions/RecentTransactionsProvider'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

type NewTrackedTransactionRequest = {
  labels: TransactionLabels
  hash?: Address
  chain?: GqlChain
}

export function useOnTransactionSubmission({ labels, hash, chain }: NewTrackedTransactionRequest) {
  const { addTrackedTransaction } = useRecentTransactions()

  // on successful submission to chain, add tx to cache
  useEffect(() => {
    if (hash) {
      addTrackedTransaction({
        hash,
        chain,
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
