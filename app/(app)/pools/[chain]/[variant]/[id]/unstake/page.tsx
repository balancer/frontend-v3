'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { UnstakeForm } from '@/lib/modules/pool/actions/unstake/UnstakeForm'

export default function UnstakePage() {
  return (
    <PoolActionsLayout>
      <UnstakeForm />
    </PoolActionsLayout>
  )
}
