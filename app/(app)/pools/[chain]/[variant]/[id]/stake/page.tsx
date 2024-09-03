/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { StakeForm } from '@/lib/modules/pool/actions/stake/StakeForm'
import { StakeProvider } from '@/lib/modules/pool/actions/stake/StakeProvider'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'

export default function StakePage() {
  return (
    <DefaultPageContainer>
      <StakeProvider>
        <PoolActionsLayout>
          <StakeForm />
        </PoolActionsLayout>
      </StakeProvider>
    </DefaultPageContainer>
  )
}
