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
  PopoverHeader,
  PopoverTrigger,
  Text,
  Tooltip,
  VStack,
  Center,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react'
import {
  TrackedTransaction,
  TransactionStatus,
  useRecentTransactions,
} from '@/lib/modules/transactions/RecentTransactionsProvider'
import { isEmpty, orderBy } from 'lodash'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { useBlockExplorer } from '../../hooks/useBlockExplorer'
import { Activity, Check } from 'react-feather'

function TransactionIcon({ status }: { status: TransactionStatus }) {
  switch (status) {
    case 'confirming':
      return (
        <CircularProgress
          value={100}
          isIndeterminate
          trackColor="border.base"
          size="5"
          color="orange.300"
        />
      )
    case 'confirmed':
      return (
        <CircularProgress value={100} trackColor="border.base" size="5" color="font.highlight">
          <CircularProgressLabel fontSize="md" color="font.highlight" pl={1}>
            <Check size={12} strokeWidth={4} />
          </CircularProgressLabel>
        </CircularProgress>
      )
    case 'reverted':
    case 'rejected':
      return (
        <CircularProgress value={100} trackColor="border.base" size={5} color="red.500" mt="1">
          <CircularProgressLabel>
            <Text fontWeight="bold" color="red.500" fontSize="xs">
              !
            </Text>
          </CircularProgressLabel>
        </CircularProgress>
      )
    default:
      return null
  }
}

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
    <HStack key={transaction.hash} p="md">
      <TransactionIcon status={transaction.status} />
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
    <VStack align="start" spacing="none">
      {orderedRecentTransactions.map(transaction => (
        <TransactionRow key={transaction.hash} transaction={transaction} />
      ))}
    </VStack>
  )
}

export default function RecentTransactions() {
  const { transactions } = useRecentTransactions()
  const hasTransactions = !isEmpty(transactions)

  const confirmingTxCount = Object.values(transactions).filter(
    tx => tx.status === 'confirming'
  ).length

  return (
    <Popover>
      <PopoverTrigger>
        <Button variant="tertiary" p="0">
          {confirmingTxCount > 0 ? (
            <CircularProgress
              value={100}
              isIndeterminate
              trackColor="border.base"
              thickness="8"
              size="7"
              color="orange.300"
            >
              <CircularProgressLabel fontSize="sm" fontWeight="bold" color="orange.300">
                {confirmingTxCount}
              </CircularProgressLabel>
            </CircularProgress>
          ) : (
            <Activity size={18} />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent w="330px">
        <PopoverArrow bg="background.level3" />
        <PopoverCloseButton />
        <PopoverHeader>
          <Heading size="md">Recent transactions</Heading>
        </PopoverHeader>
        <PopoverBody maxH="200px" overflowY="auto" p={0}>
          {hasTransactions ? (
            <Transactions transactions={transactions} />
          ) : (
            <Center p="md">
              <Text color="font.secondary">No transactions...</Text>
            </Center>
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
