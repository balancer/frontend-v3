'use client'

import TransactionFlow from '@/components/btns/transaction-steps/TransactionFlow'
import { useConstructRelayerApprovalStep } from './steps/relayerApproval'
import { Flex, VStack } from '@chakra-ui/react'
import RecentTransactions from './RecentTransactions'

export function JoinExample() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step: relayerApprovalStep } = useConstructRelayerApprovalStep()

  //setApprovalArgs allows changing arguments
  // TODO: Should we extract useState here??'
  // TODO: Should we manage {userAddress} = useAccount externally and disable all FlowSteps globally?

  // return <TransactionStepButton transactionStep={transactionStep}></TransactionStepButton>

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  return (
    <VStack width="full">
      <RecentTransactions />
      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[relayerApprovalStep]}
        />
      </Flex>
    </VStack>
  )
}
