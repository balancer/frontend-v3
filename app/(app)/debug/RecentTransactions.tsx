import React from 'react'
import { HStack, Heading, Link, Spinner, Text, VStack } from '@chakra-ui/react'
import { useRecentTransactions } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { orderBy } from 'lodash'

export default function RecentTransactions() {
  const { transactions: recentTransactions } = useRecentTransactions()

  const orderedRecentTransactions = orderBy(Object.values(recentTransactions), 'timestamp', 'desc')
  return (
    <VStack background="gray.100" p="4" rounded="md">
      <Heading size="sm">Recent Transactions</Heading>
      {orderedRecentTransactions.map(tx => {
        return (
          <VStack p="2" px="4" bg="white" rounded="md" key={tx.hash}>
            <HStack>
              {tx.status === 'confirming' && <Spinner size="sm" />}
              <Text>{tx.label}</Text>
              <Link href={`https://etherscan.io/tx/${tx.hash}`} target="_blank">
                Etherscan Link
              </Link>
            </HStack>
          </VStack>
        )
      })}
    </VStack>
  )
}
