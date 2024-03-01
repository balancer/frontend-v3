'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { AddLiquidityForm } from '@/lib/modules/pool/actions/add-liquidity/form/AddLiquidityForm'
import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { CurrentFlowStepProvider } from '@/lib/modules/pool/actions/useCurrentFlowStep'

export default function AddLiquidityPage() {
  return (
    <RelayerSignatureProvider>
      <TokenInputsValidationProvider>
        <AddLiquidityProvider>
          <PoolActionsLayout>
            <CurrentFlowStepProvider>
              <AddLiquidityForm />
            </CurrentFlowStepProvider>
          </PoolActionsLayout>
        </AddLiquidityProvider>
      </TokenInputsValidationProvider>
    </RelayerSignatureProvider>
  )
}
