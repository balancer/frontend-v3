'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { RemoveLiquidityForm } from '@/lib/modules/pool/actions/remove-liquidity/form/RemoveLiquidityForm'
import { RemoveLiquidityProvider } from '@/lib/modules/pool/actions/remove-liquidity/useRemoveLiquidity'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { CurrentFlowStepProvider } from '@/lib/modules/pool/actions/useCurrentFlowStep'

export default function RemoveLiquidityPage() {
  return (
    <RelayerSignatureProvider>
      <RemoveLiquidityProvider>
        <PoolActionsLayout>
          <CurrentFlowStepProvider>
            <RemoveLiquidityForm />
          </CurrentFlowStepProvider>
        </PoolActionsLayout>
      </RemoveLiquidityProvider>
    </RelayerSignatureProvider>
  )
}
