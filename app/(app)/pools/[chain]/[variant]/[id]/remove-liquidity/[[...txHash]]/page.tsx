'use client'

import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { RemoveLiquidityForm } from '@/lib/modules/pool/actions/remove-liquidity/form/RemoveLiquidityForm'
import { RemoveLiquidityProvider } from '@/lib/modules/pool/actions/remove-liquidity/useRemoveLiquidity'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TransactionStateProvider } from '@/lib/modules/transactions/transaction-steps/TransactionStateProvider'
import { PriceImpactProvider } from '@/lib/modules/price-impact/usePriceImpact'
import { isHash } from 'viem'

type Props = {
  params: { txHash?: string[] }
}

export default function RemoveLiquidityPage({ params: { txHash } }: Props) {
  const maybeTxHash = txHash?.[0] || ''
  const urlTxHash = isHash(maybeTxHash) ? maybeTxHash : undefined

  return (
    <TransactionStateProvider>
      <RelayerSignatureProvider>
        <RemoveLiquidityProvider urlTxHash={urlTxHash}>
          <PoolActionsLayout>
            <PriceImpactProvider>
              <RemoveLiquidityForm />
            </PriceImpactProvider>
          </PoolActionsLayout>
        </RemoveLiquidityProvider>
      </RelayerSignatureProvider>
    </TransactionStateProvider>
  )
}
