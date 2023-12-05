'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { AddLiquidityForm } from '@/lib/modules/pool/actions/add-liquidity/AddLiquidityForm'
import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'

export default function AddLiquidityPage() {
  return (
    <AddLiquidityProvider>
      <PoolActionsLayout>
        <AddLiquidityForm />
      </PoolActionsLayout>
    </AddLiquidityProvider>
  )
}
