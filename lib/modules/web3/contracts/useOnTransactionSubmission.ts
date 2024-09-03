import { useEffect } from 'react'
import { Address } from 'viem'
import { TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { AnalyticsEvent, trackEvent } from '@/lib/shared/services/fathom/Fathom'
import { useTransactionState } from '../../transactions/transaction-steps/TransactionStateProvider'

type NewTrackedTransactionRequest = {
  labels: TransactionLabels
  chain: GqlChain
  hash?: Address
}

export function useOnTransactionSubmission({ labels, hash, chain }: NewTrackedTransactionRequest) {
  const { recentTransactions } = useTransactionState()

  // on successful submission to chain, add tx to cache
  useEffect(() => {
    if (hash) {
      trackEvent(AnalyticsEvent.TransactionSubmitted)
      recentTransactions.addTrackedTransaction({
        hash,
        chain,
        label: labels.confirming || 'Confirming transaction',
        description: labels.description,
        status: 'confirming',
        timestamp: Date.now(),
        init: labels.init,
        poolId: labels.poolId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash])
}
