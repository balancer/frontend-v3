'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { RemoveLiquidityForm } from '@/lib/modules/pool/actions/remove-liquidity/form/RemoveLiquidityForm'
import { RemoveLiquidityProvider } from '@/lib/modules/pool/actions/remove-liquidity/useRemoveLiquidity'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'

export default function RemoveLiquidityPage() {
  return (
    <RelayerSignatureProvider>
      <RemoveLiquidityProvider>
        <PoolActionsLayout>
          <RemoveLiquidityForm />
        </PoolActionsLayout>
      </RemoveLiquidityProvider>
    </RelayerSignatureProvider>
  )
}
