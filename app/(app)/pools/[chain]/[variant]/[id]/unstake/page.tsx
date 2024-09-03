'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { UnstakeForm } from '@/lib/modules/pool/actions/unstake/UnstakeForm'
import { UnstakeProvider } from '@/lib/modules/pool/actions/unstake/UnstakeProvider'
import { DefaultPageContainer } from '@/lib/shared/components/containers/DefaultPageContainer'

export default function UnstakePage() {
  return (
    <DefaultPageContainer>
      <UnstakeProvider>
        <PoolActionsLayout>
          <UnstakeForm />
        </PoolActionsLayout>
      </UnstakeProvider>
    </DefaultPageContainer>
  )
}
