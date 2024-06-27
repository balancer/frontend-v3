/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { StakeForm } from '@/lib/modules/pool/actions/stake/StakeForm'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { StakeProvider } from '@/lib/modules/pool/actions/stake/StakeProvider'

export default function StakePage() {
  return (
    <TransactionStateProvider>
      <StakeProvider>
        <PoolActionsLayout>
          <StakeForm />
        </PoolActionsLayout>
      </StakeProvider>
    </TransactionStateProvider>
  )
}
