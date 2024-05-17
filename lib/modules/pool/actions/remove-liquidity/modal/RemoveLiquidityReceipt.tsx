'use client'

import { Card, Text, VStack } from '@chakra-ui/react'
import { useRemoveLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { Hash } from 'viem'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { TokenRowGroup } from '@/lib/modules/tokens/TokenRow/TokenRowGroup'
import { BptRow } from '@/lib/modules/tokens/TokenRow/BptRow'
import { useRemoveLiquidity } from '../useRemoveLiquidity'
import { usePool } from '../../../usePool'

export function RemoveLiquidityReceipt({ txHash }: { txHash: Hash }) {
  const { pool } = usePool()
  const { totalUSDValue } = useRemoveLiquidity()
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
          amounts={receivedTokens}
          chain={pool.chain}
          totalUSDValue={totalUSDValue}
          isLoading={isLoading}
        />
      </Card>
    </VStack>
  )
}