'use client'

import TransactionFlow from '@/components/btns/transaction-steps/TransactionFlow'
import { useConstructJoinPoolStep } from '@/lib/modules/steps/join/useConstructJoinPoolStep'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'
import { Flex, VStack } from '@chakra-ui/react'
import { useBalance } from 'wagmi'

export function JoinPool2() {
  const poolId = '0x68e3266c9c8bbd44ad9dca5afbfe629022aee9fe000200000000000000000512' // Balancer 50COMP-50wstETH
  const { step: joinStep } = useConstructJoinPoolStep(poolId)

  const { address } = useUserAccount()
  const wstETHAddress = '0x198d7387fa97a73f05b8578cdeff8f2a1f34cd1f'

  const { data: wstETHBalance } = useBalance({ address, token: wstETHAddress })

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  return (
    <VStack width="full">
      <Flex>
        <TransactionFlow
          completedAlertContent="Successfully joined pool"
          onCompleteClick={handleJoinCompleted}
          completedButtonLabel="Return to pool"
          steps={[joinStep]}
        />
        {/* <Button onClick={() => joinQuery.refetch()}>Refetch</Button> */}
      </Flex>
      <Flex>wsETH User Balance: {wstETHBalance ? wstETHBalance.formatted : '-'} </Flex>
    </VStack>
  )
}
