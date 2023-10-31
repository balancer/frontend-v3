'use client'

import TransactionFlow from '@/lib/shared/components/btns/transaction-steps/TransactionFlow'
import { useConstructRelayerApprovalStep } from '@/lib/modules/steps/useConstructRelayerApprovalStep'
import { Flex, VStack } from '@chakra-ui/react'
import RecentTransactions from './RecentTransactions'
import { useUserTokenBalance } from '@/lib/modules/web3/useUserTokenBalance'

export function Approval() {
  const wethAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
  const { formattedBalance } = useUserTokenBalance(wethAddress)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step: relayerApprovalStep } = useConstructRelayerApprovalStep()

  function handleJoinCompleted() {
    console.log('Approval completed')
  }

  return (
    <VStack width="full">
      <RecentTransactions />
      <Flex>WETH balance: {formattedBalance}</Flex>
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
