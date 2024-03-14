'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { RemoveLiquidityForm } from '@/lib/modules/pool/actions/remove-liquidity/form/RemoveLiquidityForm'
import { RemoveLiquidityProvider } from '@/lib/modules/pool/actions/remove-liquidity/useRemoveLiquidity'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { PriceImpactProvider } from '@/lib/shared/hooks/usePriceImpact'

export default function RemoveLiquidityPage() {
  return (
    <RelayerSignatureProvider>
      <RemoveLiquidityProvider>
        <PoolActionsLayout>
          <PriceImpactProvider>
            <RemoveLiquidityForm />
          </PriceImpactProvider>
        </PoolActionsLayout>
      </RemoveLiquidityProvider>
    </RelayerSignatureProvider>
  )
}
