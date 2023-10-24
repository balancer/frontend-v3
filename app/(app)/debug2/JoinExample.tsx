'use client'

import TransactionFlow from '@/components/btns/transaction-steps/TransactionFlow'
import { useConstructJoinPoolStep } from './steps/joinPool'
import { Flex, VStack } from '@chakra-ui/react'
import { JoinPool } from './JoinPool'

export function JoinExample() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step } = useConstructJoinPoolStep()

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
        <JoinPool></JoinPool>
        <TransactionFlow
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[step]}
        />
      </Flex>
    </VStack>
  )
}
