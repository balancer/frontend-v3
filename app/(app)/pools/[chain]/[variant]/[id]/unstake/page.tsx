'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { UnstakeForm } from '@/lib/modules/pool/actions/unstake/UnstakeForm'
import { UnstakeProvider } from '@/lib/modules/pool/actions/unstake/UnstakeProvider'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export default function UnstakePage() {
  return (
    <TransactionStateProvider>
      <UnstakeProvider>
        <PoolActionsLayout>
          <UnstakeForm />
        </PoolActionsLayout>
      </UnstakeProvider>
    </TransactionStateProvider>
  )
}
