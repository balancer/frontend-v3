'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { MigrateStakeForm } from '@/lib/modules/pool/actions/migrateStake/MigrateStakeForm'
import { MigrateStakeProvider } from '@/lib/modules/pool/actions/migrateStake/MigrateStakeProvider'
import { UnstakeProvider } from '@/lib/modules/pool/actions/unstake/UnstakeProvider'

export default function MigrateStakePage() {
  return (
    <UnstakeProvider>
      <MigrateStakeProvider>
        <PoolActionsLayout>
          <MigrateStakeForm />
        </PoolActionsLayout>
      </MigrateStakeProvider>
    </UnstakeProvider>
  )
}
