'use client'

import TransactionFlow from '@/components/btns/transaction-steps/TransactionFlow'
import { useConstructRelayerApprovalStep } from '@/lib/modules/steps/useConstructRelayerApprovalStep'
import { Flex, VStack } from '@chakra-ui/react'
import RecentTransactions from './RecentTransactions'

export function Approval() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step: relayerApprovalStep } = useConstructRelayerApprovalStep()

  function handleJoinCompleted() {
    console.log('Approval completed')
  }

  return (
    <VStack width="full">
      <RecentTransactions />
      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully relayer approval"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[relayerApprovalStep]}
        />
      </Flex>
    </VStack>
  )
}
