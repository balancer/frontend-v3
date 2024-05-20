'use client'

import { Button, Card, Text, useDisclosure, VStack } from '@chakra-ui/react'
import { usePool } from '../../../usePool'
import { ReceiptBptOut } from './BptOut'
import { StakingOptions } from './StakingOptions'
import { useAddLiquidityReceipt } from '@/lib/modules/transactions/transaction-steps/useTransactionLogsQuery'
import { Hash } from 'viem'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { isVebalPool } from '../../../pool.helpers'
import { VebalRedirectModal } from '@/lib/modules/vebal/VebalRedirectModal'
import { TokenRowGroup } from '@/lib/modules/tokens/TokenRow/TokenRowGroup'
import { useAddLiquidity } from '../useAddLiquidity'

export function AddLiquidityReceipt({ txHash }: { txHash: Hash }) {
  const { pool } = usePool()
  const { validTokens } = useAddLiquidity()
  const { userAddress, isLoading: isUserAddressLoading } = useUserAccount()
  const { isLoading, error, sentTokens, receivedBptUnits } = useAddLiquidityReceipt({
    txHash,
    userAddress,
  })
  const { isOpen, onClose, onOpen } = useDisclosure()

  if (!isUserAddressLoading && !userAddress) return <Text>User is not connected</Text>
  if (error) return <Text>We were unable to find this transaction hash</Text>

  return (
    <VStack spacing="sm" align="start">
      <Card variant="modalSubSection">
        <TokenRowGroup
          label="You added"
          amounts={sentTokens}
          tokens={validTokens}
          chain={pool.chain}
          isLoading={isLoading}
        />
      </Card>
      <Card variant="modalSubSection">
        <ReceiptBptOut actualBptOut={receivedBptUnits} isLoading={isLoading} />
      </Card>
      {pool.staking && (
        <Card variant="modalSubSection">
          <StakingOptions />
        </Card>
      )}
      {isVebalPool(pool.id) && (
        <Card variant="modalSubSection">
          <VStack align="start" w="full" spacing="md">
            <Text>Get extra incentives with veBAL</Text>
            <Button variant="primary" size="lg" onClick={onOpen} w="full">
              Lock to get veBAL
            </Button>
          </VStack>

          <VebalRedirectModal isOpen={isOpen} onClose={onClose} />
        </Card>
      )}
    </VStack>
  )
}
