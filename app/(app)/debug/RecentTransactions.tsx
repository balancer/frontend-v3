import React from 'react'
import { HStack, Heading, Link, Spinner, Text, VStack } from '@chakra-ui/react'
import { useRecentTransactions } from '@/lib/modules/transactions/RecentTransactionsProvider'
import { orderBy } from 'lodash'
import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export default function RecentTransactions() {
  const { transactions: recentTransactions } = useRecentTransactions()

  const orderedRecentTransactions = orderBy(Object.values(recentTransactions), 'timestamp', 'desc')
  return (
    <VStack background="gray.100" p="4" rounded="md">
      <Heading size="sm">Recent Transactions</Heading>
      {orderedRecentTransactions.map(tx => {
        const networkConfigForTxChain = getNetworkConfig(tx.chain || GqlChain.Mainnet)
        return (
          <VStack p="2" px="4" bg="white" rounded="md" key={tx.hash}>
            <HStack>
              {tx.status === 'confirming' && <Spinner size="sm" />}
              <Text>{tx.label}</Text>
              <Link
                href={`${networkConfigForTxChain.blockExplorerBaseUrl}/tx/${tx.hash}`}
                target="_blank"
              >
                Etherscan Link
              </Link>
            </HStack>
          </VStack>
        )
      })}
    </VStack>
  )
}
