'use client'

import TransactionFlow from '@/components/btns/transaction-steps/TransactionFlow'
import { useConstructRelayerApprovalStep } from './steps/relayerApproval'
import { Flex, HStack, Heading, Link, Spinner, Text, VStack } from '@chakra-ui/react'
import { useRecentTransactions } from '@/lib/modules/transactions/RecentTransactionsProvider'

export function JoinExample() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { step: relayerApprovalStep } = useConstructRelayerApprovalStep()
  const { transactions: recentTransactions } = useRecentTransactions()

  //setApprovalArgs allows changing arguments
  // TODO: Should we extract useState here??'
  // TODO: Should we manage {userAddress} = useAccount externally and disable all FlowSteps globally?

  // return <TransactionStepButton transactionStep={transactionStep}></TransactionStepButton>

  function handleJoinCompleted() {
    console.log('Join completed')
  }

  return (
    <VStack width="full">
      <VStack background="gray.100" p="4" rounded="md">
        <Heading size="sm">Recent Transactions</Heading>
        {Object.keys(recentTransactions).map(hash => {
          const tx = recentTransactions[hash]
          return (
            <VStack p="2" px="4" bg="white" rounded="md" key={hash}>
              <HStack>
                {tx.status === 'confirming' && <Spinner size="sm" />}
                <Text>{tx.label}</Text>
                <Link href={`https://etherscan.io/tx/${hash}`} target="_blank">
                  Etherscan Link
                </Link>
              </HStack>
            </VStack>
          )
        })}
      </VStack>
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
