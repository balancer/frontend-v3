'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { AddLiquidityForm } from '@/lib/modules/pool/actions/add-liquidity/form/AddLiquidityForm'
import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { isNotSupported } from '@/lib/modules/pool/pool.helpers'
import { usePool } from '@/lib/modules/pool/usePool'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { useCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { PriceImpactProvider } from '@/lib/shared/hooks/usePriceImpact'
import { Alert } from '@chakra-ui/react'

export default function AddLiquidityPage() {
  const { isFlowComplete } = useCurrentFlowStep()
  const { pool } = usePool()
  if (isNotSupported(pool)) {
    return (
      <Alert status="info" w="fit-content" minW="50%">
        This pool type is not currently supported in the Balancer V3 UI
      </Alert>
    )
  }

  return (
    <RelayerSignatureProvider>
      <TokenInputsValidationProvider>
        <AddLiquidityProvider>
          <PriceImpactProvider>
            <PoolActionsLayout isFlowComplete={isFlowComplete}>
              <AddLiquidityForm />
            </PoolActionsLayout>
          </PriceImpactProvider>
        </AddLiquidityProvider>
      </TokenInputsValidationProvider>
    </RelayerSignatureProvider>
  )
}
