import React from 'react'
import {
  Button,
  HStack,
  Heading,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
  VStack,
} from '@chakra-ui/react'
import {
  TrackedTransaction,
  useRecentTransactions,
} from '@/lib/modules/transactions/RecentTransactionsProvider'
import { isEmpty, orderBy } from 'lodash'
import { FiActivity } from 'react-icons/fi'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'

function Transactions({ transactions }: { transactions: Record<string, TrackedTransaction> }) {
  const networkConfig = useNetworkConfig()
  const orderedRecentTransactions = orderBy(Object.values(transactions), 'timestamp', 'desc')

  return (
    <VStack p="4" rounded="md" align="start">
      {orderedRecentTransactions.map(tx => {
        return (
          <HStack key={tx.hash}>
            <Tooltip label={tx.init} fontSize="sm">
              <Text isTruncated maxW="80%">
                {tx.init}
              </Text>
            </Tooltip>
            <Link href={`${networkConfig.blockExplorerBaseUrl}/tx/${tx.hash}`} target="_blank">
              <ExternalLinkIcon color="gray.400" width="1rem" height="1rem" />
            </Link>
          </HStack>
        )
      })}
    </VStack>
  )
}

export default function RecentTransactions() {
  const { transactions, setTransactions } = useRecentTransactions()
  const hasTransactions = !isEmpty(transactions)

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="tertiary" size="sm">
          <FiActivity />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Recent transactions</Heading>
        </PopoverHeader>
        <PopoverBody>
          {hasTransactions ? (
            <Transactions transactions={transactions} />
          ) : (
            <Text>No transactions...</Text>
          )}
        </PopoverBody>
        <PopoverFooter>
          <Button isDisabled={!hasTransactions} onClick={() => setTransactions({})}>
            Clear transactions
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
