'use client'

import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react'
import { usePool } from '../../usePool'
import { SuccessCard } from '@/lib/modules/transactions/transaction-steps/SuccessCard'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { usePoolRedirect, useRefetchPoolOnFlowComplete } from '../../pool.hooks'
import { BptOutCardFromReceipt } from './modal/BptOutCard'
import { StakingOptions } from './modal/StakingOptions'
import { TokensInCardFromReceipt } from './modal/TokensInCard'
import { useReceipt } from '../../../transactions/transaction-steps/useReceipt'
import { useAddLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { Hash } from 'viem'

export function AddLiquidityReceipt() {
  const { pool } = usePool()
  const { redirectToPoolPage } = usePoolRedirect(pool)
  const { didRefetchPool } = useRefetchPoolOnFlowComplete()
  const { keepsFlowState, txHash } = useReceipt()
  const { isLoading: isLoadingUserAccount, userAddress } = useUserAccount()
  const { isLoading, error } = useAddLiquidityReceipt({
    userAddress,
    txHash: txHash as Hash,
  })

  if (isLoading || isLoadingUserAccount) return null
  if (!userAddress) return <Text>User is not connected</Text>
  if (error) return <Text>We were unable to find this transaction hash</Text>

  return (
    <Center>
      <VStack w="fit-content" alignContent="center">
        <Heading>Add liquidity receipt {!keepsFlowState && '(historical)'}</Heading>
        <VStack spacing="sm" align="start">
          {keepsFlowState && <SuccessCard chain={pool.chain} />}

          <TokensInCardFromReceipt />

          <BptOutCardFromReceipt />

          {keepsFlowState && pool.dynamicData.apr.hasRewardApr && <StakingOptions />}
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
