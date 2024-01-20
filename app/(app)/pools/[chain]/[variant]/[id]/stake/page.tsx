'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { StakeForm } from '@/lib/modules/pool/actions/stake/StakeForm'

export default function AddLiquidityPage() {
  return (
    <PoolActionsLayout>
      <StakeForm />
    </PoolActionsLayout>
  )
}
