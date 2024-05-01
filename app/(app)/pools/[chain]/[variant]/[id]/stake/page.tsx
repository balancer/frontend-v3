'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { StakeForm } from '@/lib/modules/pool/actions/stake/StakeForm'
import { TransactionFlowProvider } from '@/lib/modules/transactions/transaction-steps/TransactionFlowProvider'

export default function StakePage() {
  return (
    <TransactionFlowProvider>
      <PoolActionsLayout>
        <StakeForm />
      </PoolActionsLayout>
    </TransactionFlowProvider>
  )
}
