'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { AddLiquidityForm } from '@/lib/modules/pool/actions/add-liquidity/form/AddLiquidityForm'
import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { CurrentFlowStepProvider } from '@/lib/shared/components/btns/transaction-steps/useCurrentFlowStep'
import { PriceImpactProvider } from '@/lib/shared/hooks/usePriceImpact'

export default function AddLiquidityPage() {
  return (
    <RelayerSignatureProvider>
      <TokenInputsValidationProvider>
        <AddLiquidityProvider>
          <PriceImpactProvider>
            <PoolActionsLayout>
              <CurrentFlowStepProvider>
                <AddLiquidityForm />
              </CurrentFlowStepProvider>
            </PoolActionsLayout>
          </PriceImpactProvider>
        </AddLiquidityProvider>
      </TokenInputsValidationProvider>
    </RelayerSignatureProvider>
  )
}
