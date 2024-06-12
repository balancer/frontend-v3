'use client'

import { useSwapReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { useUserAccount } from '@/lib/modules/web3/UserAccountProvider'
import { Card, Skeleton, Text, VStack } from '@chakra-ui/react'
import { Hash } from 'viem'
import { useSwap } from '../SwapProvider'
import { ReceiptTokenOutRow, SwapTokenRow } from '../../tokens/TokenRow/SwapTokenRow'

export function SwapReceipt({ txHash }: { txHash: Hash }) {
  const { selectedChain } = useSwap()
  const { userAddress, isLoading: isUserAddressLoading } = useUserAccount()
  const { isLoading, error, sentToken, receivedToken } = useSwapReceipt({
    txHash,
    userAddress,
    chain: selectedChain,
  })

  if (!isUserAddressLoading && !userAddress) return <Text>User is not connected</Text>
  if (error) return <Text>We were unable to find this transaction hash</Text>

  return (
    <VStack spacing="sm" align="start">
      {isLoading ? (
        <Skeleton h="80px" w="full" />
      ) : (
        <Card variant="modalSubSection">
          {sentToken && (
            <SwapTokenRow
              label="You paid"
              chain={selectedChain}
              tokenAmount={sentToken.humanAmount}
              tokenAddress={sentToken.tokenAddress}
            />
          )}
        </Card>
      )}
      {isLoading ? (
        <Skeleton h="80px" w="full" />
      ) : (
        <Card variant="modalSubSection">
          {receivedToken && (
            <ReceiptTokenOutRow
              chain={selectedChain}
              actualReceivedTokenAmount={receivedToken.humanAmount || '0'}
              tokenAddress={receivedToken.tokenAddress}
            />
          )}
        </Card>
      )}
    </VStack>
  )
}
