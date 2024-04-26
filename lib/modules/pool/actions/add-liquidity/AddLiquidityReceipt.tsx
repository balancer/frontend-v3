'use client'

import { Button, Card, Center, Heading, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { SuccessCard } from '@/lib/modules/transactions/transaction-steps/SuccessCard'
import { usePoolRedirect, useRefetchPoolOnFlowComplete } from '../../pool.hooks'
import { ReceiptBptOut } from './modal/BptOut'
import { StakingOptions } from './modal/StakingOptions'
import { ReceiptTokensIn } from './modal/TokensIn'
import { useReceipt } from '../../../transactions/transaction-steps/useReceipt'
import { useAddLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { Hash } from 'viem'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

export function AddLiquidityReceipt() {
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)
  const { didRefetchPool } = useRefetchPoolOnFlowComplete()
  const { keepsFlowState, txHash } = useReceipt()
  const { userAddress, isLoading: isUserAddressLoading } = useUserAccount()
  const { isLoading, error, sentTokens, receivedBptUnits } = useAddLiquidityReceipt({
    txHash: txHash as Hash,
    userAddress,
  })

  if (!isUserAddressLoading && !userAddress) return <Text>User is not connected</Text>
  if (isLoading) return null
  if (error) return <Text>We were unable to find this transaction hash</Text>

  return (
    <Center>
      <VStack w="fit-content" alignContent="center">
        <Heading>{!keepsFlowState && '(historical)'}</Heading>
        <VStack spacing="0.5" align="start">
          {keepsFlowState && <SuccessCard chain={pool.chain} />}

          <Card variant="level2" borderRadius="12px 12px 0px 0px">
            <ReceiptTokensIn sentTokens={sentTokens} />
          </Card>
          <Card variant="level2" borderRadius="0px">
            <ReceiptBptOut receivedBptUnits={receivedBptUnits} />
          </Card>
          <Card variant="level2" borderRadius="0px 0px 12px 12px" mt="1">
            {keepsFlowState && pool.dynamicData.apr.hasRewardApr && <StakingOptions />}
          </Card>
        </VStack>
        <Button
          variant="tertiary"
          w="full"
          size="lg"
          onClick={redirectToPoolPage}
          isLoading={!didRefetchPool && keepsFlowState}
        >
          Return to pool
        </Button>
      </VStack>
    </Center>
  )
}
