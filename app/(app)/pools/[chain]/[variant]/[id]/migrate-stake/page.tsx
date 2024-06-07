'use client'

import { usePool } from '@/lib/modules/pool/PoolProvider'
import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { MigrateStakeForm } from '@/lib/modules/pool/actions/migrateStake/MigrateStakeForm'
import { MigrateStakeProvider } from '@/lib/modules/pool/actions/migrateStake/MigrateStakeProvider'
import { UnstakeProvider } from '@/lib/modules/pool/actions/unstake/UnstakeProvider'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'

export default function MigrateStakePage() {
  //TODO: this is needed until the API has non-preferential staked balance
  const { isLoading } = usePool()
  return (
    <TransactionStateProvider>
      <PoolActionsLayout>
        {isLoading ? (
          <div>Pool balances loading...</div>
        ) : (
          <UnstakeProvider>
            <MigrateStakeProvider>
              <MigrateStakeForm />
            </MigrateStakeProvider>
          </UnstakeProvider>
        )}
      </PoolActionsLayout>
    </TransactionStateProvider>
  )
}
