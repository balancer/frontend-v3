'use client'

import TransactionStepsButton from '@/components/btns/transaction-steps/TransactionStepsButton'
import { useConstructRelayerApprovalStep } from './steps/relayerApproval'
import { Flex, VStack } from '@chakra-ui/react'

export function JoinExample() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step: relayerApprovalStep, setApprovalArgs } = useConstructRelayerApprovalStep()

  //setApprovalArgs allows changing arguments
  // TODO: Should we extract useState here??'
  // TODO: Should we manage {userAddress} = useAccount externally and disable all FlowSteps globally?

  // return <TransactionStepButton transactionStep={transactionStep}></TransactionStepButton>

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  return (
    <VStack width="full">
      <Flex>
        <TransactionStepsButton
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[relayerApprovalStep]}
        />
      </Flex>
    </VStack>
  )
}
