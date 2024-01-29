'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { StakeForm } from '@/lib/modules/pool/actions/stake/StakeForm'
import { StakingProvider } from '@/lib/modules/pool/actions/stake/useStaking'

export default function StakingPage() {
  return (
    <StakingProvider>
      <PoolActionsLayout>
        <StakeForm />
      </PoolActionsLayout>
    </StakingProvider>
  )
}
