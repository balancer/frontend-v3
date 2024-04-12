'use client'

import { getChainId } from '@/lib/config/app.config'
import { PoolActionsLayout } from '@/lib/modules/pool/actions/PoolActionsLayout'
import { AddLiquidityProvider } from '@/lib/modules/pool/actions/add-liquidity/useAddLiquidity'
import { isNotSupported } from '@/lib/modules/pool/pool.helpers'
import { usePool } from '@/lib/modules/pool/usePool'
import { RelayerSignatureProvider } from '@/lib/modules/relayer/useRelayerSignature'
import { TokenInputsValidationProvider } from '@/lib/modules/tokens/useTokenInputsValidation'
import { useCurrentFlowStep } from '@/lib/modules/transactions/transaction-steps/useCurrentFlowStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { PriceImpactProvider } from '@/lib/shared/hooks/usePriceImpact'
import { getViemClient } from '@/lib/shared/services/viem/viem.client'
import { Alert } from '@chakra-ui/react'
import { useEffect } from 'react'
import { parseAbiItem } from 'viem'
import { Address, useQuery, useTransaction } from 'wagmi'

export default function AddLiquidityTxPage({ params: { hash } }: { params: { hash: Address } }) {
  const { isFlowComplete } = useCurrentFlowStep()
  const { pool } = usePool()
  const { userAddress } = useUserAccount()
  const viemClient = getViemClient(pool.chain)
  const receipt = useTransaction({ hash, chainId: getChainId(pool.chain) })

  const outgoingLogsQuery = useQuery(['tx.logs.outgoing', receipt.data?.blockHash], () =>
    viemClient.getLogs({
      blockHash: receipt?.data?.blockHash,
      event: parseAbiItem(
        'event Transfer(address indexed from, address indexed to, uint256 value)'
      ),
      args: { from: userAddress },
    })
  )

  const incomingLogsQuery = useQuery(['tx.logs.incoming', receipt.data?.blockHash], () =>
    viemClient.getLogs({
      blockHash: receipt?.data?.blockHash,
      event: parseAbiItem(
        'event Transfer(address indexed from, address indexed to, uint256 value)'
      ),
      args: { to: userAddress },
    })
  )

  useEffect(() => {
    console.log('Outgoing', outgoingLogsQuery.data)
  }, [outgoingLogsQuery.data])

  useEffect(() => {
    console.log('Incoming', incomingLogsQuery.data)
  }, [incomingLogsQuery.data])

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
            <PoolActionsLayout isFlowComplete={isFlowComplete}>{hash}</PoolActionsLayout>
          </PriceImpactProvider>
        </AddLiquidityProvider>
      </TokenInputsValidationProvider>
    </RelayerSignatureProvider>
  )
}
