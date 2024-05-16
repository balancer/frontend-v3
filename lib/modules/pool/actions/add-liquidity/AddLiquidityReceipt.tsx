'use client'

import { Card, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { ReceiptBptOut } from './modal/BptOut'
import { StakingOptions } from './modal/StakingOptions'
import { ReceiptTokensIn } from './modal/TokensIn'
import { useAddLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { Hash } from 'viem'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

export function AddLiquidityReceipt({ txHash }: { txHash: Hash }) {
  const { pool } = usePool()
  const { userAddress, isLoading: isUserAddressLoading } = useUserAccount()
  const { isLoading, error, sentTokens, receivedBptUnits } = useAddLiquidityReceipt({
    txHash,
    userAddress,
  })

  if (!isUserAddressLoading && !userAddress) return <Text>User is not connected</Text>
  if (error) return <Text>We were unable to find this transaction hash</Text>

  return (
    <VStack spacing="sm" align="start">
      <Card variant="modalSubSection">
        <ReceiptTokensIn sentTokens={sentTokens} isLoading={isLoading} />
      </Card>
      <Card variant="modalSubSection">
        <ReceiptBptOut actualBptOut={receivedBptUnits} isLoading={isLoading} />
      </Card>
      {pool.staking && (
        <Card variant="modalSubSection">
          <StakingOptions />
        </Card>
      )}
    </VStack>
  )
}
