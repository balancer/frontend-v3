'use client'

import TransactionFlow from '@/components/btns/transaction-steps/TransactionFlow'
import { useConstructJoinPoolStep } from './steps/joinPool'
import { Flex, VStack } from '@chakra-ui/react'

export function JoinPool2() {
  const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer 50COMP-50wstETH
  const { step: joinStep } = useConstructJoinPoolStep(poolId)

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  return (
    <VStack width="full">
      <Flex>
        FOO: {joinStep.simulation.error?.name}
        <TransactionFlow
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[joinStep]}
        />
      </Flex>
    </VStack>
  )
}
