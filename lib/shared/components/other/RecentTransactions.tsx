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
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useBlockExplorer } from '../../hooks/useBlockExplorer'
import { Activity } from 'react-feather'

function TransactionRow({ transaction }: { transaction: TrackedTransaction }) {
  const { getBlockExplorerTxUrl } = useBlockExplorer(transaction.chain)
  // TODO? Add another description so it would always fit in the default width of 320px (ln 71) without truncation (ln 46)
  const label =
    transaction.description &&
    transaction.init &&
    transaction.description?.length > transaction.init.length
      ? transaction.description
      : transaction.init

  return (
    <HStack key={transaction.hash}>
      <Tooltip label={label} fontSize="sm">
        <Text isTruncated maxW="85%">
          {transaction.init}
        </Text>
      </Tooltip>
      <Link href={getBlockExplorerTxUrl(transaction.hash)} target="_blank">
        <ExternalLinkIcon color="gray.400" width="1rem" height="1rem" />
      </Link>
    </HStack>
  )
}

function Transactions({ transactions }: { transactions: Record<string, TrackedTransaction> }) {
  const orderedRecentTransactions = orderBy(Object.values(transactions), 'timestamp', 'desc')

  return (
    <VStack p="4" rounded="md" align="start">
      {orderedRecentTransactions.map(transaction => (
        <TransactionRow key={transaction.hash} transaction={transaction} />
      ))}
    </VStack>
  )
}

export default function RecentTransactions() {
  const { transactions, clearTransactions } = useRecentTransactions()
  const hasTransactions = !isEmpty(transactions)

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="tertiary" p="0">
          <Activity size={18} />
        </Button>
      </PopoverTrigger>
      <PopoverContent w="330px">
        <PopoverArrow bg="background.level3" />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Recent transactions</Heading>
        </PopoverHeader>
        <PopoverBody maxH="180px" overflowY="auto" py="4">
          {hasTransactions ? (
            <Transactions transactions={transactions} />
          ) : (
            <Text color="font.secondary">No transactions...</Text>
          )}
        </PopoverBody>
        <PopoverFooter>
          <Button isDisabled={!hasTransactions} onClick={() => clearTransactions()}>
            Clear transactions
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  )
}
