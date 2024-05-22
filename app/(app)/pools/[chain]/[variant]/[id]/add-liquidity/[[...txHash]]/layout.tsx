'use client'

import { isNotSupported } from '@/lib/modules/pool/pool.helpers'
import { usePool } from '@/lib/modules/pool/usePool'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { PriceImpactProvider } from '@/lib/modules/price-impact/usePriceImpact'
import { Alert } from '@chakra-ui/react'
import { AddLiquidityProvider } from '../../../../../../../../lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { PropsWithChildren } from 'react'
import { isHash } from 'viem'

type Props = PropsWithChildren<{
  params: { txHash?: string[] }
}>

export default function AddLiquidityLayout({ params: { txHash }, children }: Props) {
  const { pool } = usePool()

  const maybeTxHash = txHash?.[0] || ''
  const urlTxHash = isHash(maybeTxHash) ? maybeTxHash : undefined

  if (isNotSupported(pool)) {
    return (
      <Alert status="info" w="fit-content" minW="50%">
        This pool type is not currently supported in the Balancer V3 UI
      </Alert>
    )
  }

  return (
    <TransactionStateProvider>
      <RelayerSignatureProvider>
        <TokenInputsValidationProvider>
          <AddLiquidityProvider urlTxHash={urlTxHash}>
            <PriceImpactProvider>{children}</PriceImpactProvider>
          </AddLiquidityProvider>
        </TokenInputsValidationProvider>
      </RelayerSignatureProvider>
    </TransactionStateProvider>
  )
}
