'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { AddLiquidityForm } from '@/lib/modules/pool/actions/add-liquidity/AddLiquidityForm'
import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { ConnectedUserProvider } from '@/lib/modules/user/settings/useConnectedUser'

export default function AddLiquidityPage() {
  return (
    <ConnectedUserProvider>
      <AddLiquidityProvider>
        <PoolActionsLayout>
          <AddLiquidityForm />
        </PoolActionsLayout>
      </AddLiquidityProvider>
    </ConnectedUserProvider>
  )
}
