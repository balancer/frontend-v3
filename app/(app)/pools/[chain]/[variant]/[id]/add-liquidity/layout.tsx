'use client'

import { isNotSupported } from '@/lib/modules/pool/pool.helpers'
import { usePool } from '@/lib/modules/pool/usePool'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { PriceImpactProvider } from '@/lib/shared/hooks/usePriceImpact'
import { Alert } from '@chakra-ui/react'
import { AddLiquidityProvider } from '../../../../../../../lib/modules/pool/actions/add-liquidity/useAddLiquidity'

/*
  Layout used to share state between add-liquidity page and add-liquidity/[txHash] receipt page
 */
export default function AddLiquidityLayout({ children }: { children: React.ReactNode }) {
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
          <PriceImpactProvider>{children}</PriceImpactProvider>
        </AddLiquidityProvider>
      </TokenInputsValidationProvider>
    </RelayerSignatureProvider>
  )
}
