'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { RemoveLiquidityForm } from '@/lib/modules/pool/actions/remove-liquidity/form/RemoveLiquidityForm'
import { RemoveLiquidityProvider } from '@/lib/modules/pool/actions/remove-liquidity/useRemoveLiquidity'

export default function RemoveLiquidityPage() {
  return (
    <RemoveLiquidityProvider>
      <PoolActionsLayout>
        <RemoveLiquidityForm />
      </PoolActionsLayout>
    </RemoveLiquidityProvider>
  )
}
