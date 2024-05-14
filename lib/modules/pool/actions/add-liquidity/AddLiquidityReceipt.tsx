'use client'

import { Card, Center, Heading, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { BptRow, QuoteBptOut, ReceiptBptOut } from './modal/BptOut'
import { StakingOptions } from './modal/StakingOptions'
import { ReceiptTokensIn } from './modal/TokensIn'
import { useAddLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { Hash } from 'viem'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { useAddLiquidity } from './useAddLiquidity'

export function AddLiquidityReceipt({ txHash }: { txHash: Hash }) {
  const { pool } = usePool()
  const { userAddress, isLoading: isUserAddressLoading } = useUserAccount()
  const { isLoading, error, sentTokens, receivedBptUnits } = useAddLiquidityReceipt({
    txHash,
    userAddress,
  })
  const { simulationQuery } = useAddLiquidity()

  const hasQuoteContext = !!simulationQuery.data

  if (!isUserAddressLoading && !userAddress) return <Text>User is not connected</Text>
  if (isLoading) return null
  if (error) return <Text>We were unable to find this transaction hash</Text>

  return (
    <VStack spacing="sm" align="start">
      <Card variant="modalSubSection">
        <ReceiptTokensIn sentTokens={sentTokens} />
      </Card>
      <Card variant="modalSubSection">
        <ReceiptBptOut actualBptOut={receivedBptUnits} />
      </Card>
      <Card variant="modalSubSection">
        {pool.dynamicData.apr.hasRewardApr && <StakingOptions />}
      </Card>
    </VStack>
  )
}
