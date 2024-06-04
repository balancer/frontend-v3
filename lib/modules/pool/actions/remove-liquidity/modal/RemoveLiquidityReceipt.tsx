'use client'

import { Card, Text, VStack } from '@chakra-ui/react'
import { useRemoveLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { Hash } from 'viem'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { TokenRowGroup } from '@/lib/modules/tokens/TokenRow/TokenRowGroup'
import { BptRow } from '@/lib/modules/tokens/TokenRow/BptRow'
import { usePool } from '../../../PoolProvider'
import { useTokens } from '@/lib/modules/tokens/TokensProvider'

export function RemoveLiquidityReceipt({ txHash }: { txHash: Hash }) {
  const { pool } = usePool()
  const { getTokensByChain } = useTokens()
  const { userAddress, isLoading: isUserAddressLoading } = useUserAccount()
  const { isLoading, error, receivedTokens, sentBptUnits } = useRemoveLiquidityReceipt({
    txHash,
    userAddress,
  })

  if (!isUserAddressLoading && !userAddress) return <Text>User is not connected</Text>
  if (error) return <Text>We were unable to find this transaction hash</Text>

  return (
    <VStack spacing="sm" align="start">
      <Card variant="modalSubSection">
        <BptRow label="You removed" bptAmount={sentBptUnits} pool={pool} isLoading={isLoading} />
      </Card>
      <Card variant="modalSubSection">
        <TokenRowGroup
          label="You received"
          tokens={getTokensByChain(pool.chain)}
          amounts={receivedTokens}
          chain={pool.chain}
          isLoading={isLoading}
        />
      </Card>
    </VStack>
  )
}
