'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { AddLiquidityForm } from '@/lib/modules/pool/actions/add-liquidity/AddLiquidityForm'
import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'

export default function AddLiquidityPage() {
  return (
    <RelayerSignatureProvider>
      <TokenInputsValidationProvider>
        <AddLiquidityProvider>
          <PoolActionsLayout>
            <AddLiquidityForm />
          </PoolActionsLayout>
        </AddLiquidityProvider>
      </TokenInputsValidationProvider>
    </RelayerSignatureProvider>
  )
}
