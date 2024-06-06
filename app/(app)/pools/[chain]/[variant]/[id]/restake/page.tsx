'use client'

import { usePool } from '@/lib/modules/pool/PoolProvider'
import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { RestakeForm } from '@/lib/modules/pool/actions/restake/RestakeForm'
import { RestakeProvider } from '@/lib/modules/pool/actions/restake/RestakeProvider'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export default function RestakePage() {
  //TODO: this is needed until the API has non-preferential staked balance
  const { isLoading } = usePool()
  return (
    <TransactionStateProvider>
      <PoolActionsLayout>
        {isLoading ? (
          <div>Pool balances loading...</div>
        ) : (
          <RestakeProvider>
            <RestakeForm />
          </RestakeProvider>
        )}
      </PoolActionsLayout>
    </TransactionStateProvider>
  )
}
