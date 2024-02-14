'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { AddLiquidityForm } from '@/lib/modules/pool/actions/add-liquidity/AddLiquidityForm'
import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'

export default function AddLiquidityPage() {
  return (
    <RelayerSignatureProvider>
      <AddLiquidityProvider>
        <PoolActionsLayout>
          <AddLiquidityForm />
        </PoolActionsLayout>
      </AddLiquidityProvider>
    </RelayerSignatureProvider>
  )
}
