'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { UnstakeForm } from '@/lib/modules/pool/actions/unstake/UnstakeForm'
import { TransactionFlowProvider } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'

export default function UnstakePage() {
  return (
    <TransactionFlowProvider>
      <PoolActionsLayout>
        <UnstakeForm />
      </PoolActionsLayout>
    </TransactionFlowProvider>
  )
}
