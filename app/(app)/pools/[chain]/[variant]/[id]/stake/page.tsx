'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { StakeForm } from '@/lib/modules/pool/actions/stake/StakeForm'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export default function StakePage() {
  return (
    <TransactionStateProvider>
      <PoolActionsLayout>
        <StakeForm />
      </PoolActionsLayout>
    </TransactionStateProvider>
  )
}
