/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { TransactionInfo } from '@/lib/contracts/contract.types'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { useToast } from '@chakra-ui/react'
import React, { ReactNode, createContext, useState } from 'react'

export type RecentTransactionsResponse = ReturnType<typeof _useRecentTransactions>
export const TransactionsContext = createContext<RecentTransactionsResponse | null>(null)

export function _useRecentTransactions() {
  // This is an initial example to show how global transaction handling could work
  // we will need a more complex structure with grouped transactions
  const [transactions, setTransactions] = useState<TransactionInfo[]>([])
  const toast = useToast()

  function handleTransactionAdded(info: TransactionInfo) {
    toast({
      title: 'Transaction added',
      description: 'Added a transaction',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  function handleTransactionError(info: TransactionInfo) {
    toast({
      title: 'Transaction Error',
      description: 'Bingbong',
      status: 'success',
      duration: 9000,
      isClosable: true,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  function handleTransactionConfirmation(info: TransactionInfo) {}

  function addTransaction(transactionInfo: TransactionInfo) {
    setTransactions([...transactions, transactionInfo])
    handleTransactionAdded(transactionInfo)
  }

  return { transactions, addTransaction }
}

export function RecentTransactionsProvider({ children }: { children: ReactNode }) {
  const transactions = _useRecentTransactions()
  return (
    <TransactionsContext.Provider value={transactions}>{children}</TransactionsContext.Provider>
  )
}

export const useRecentTransactions = () =>
  useMandatoryContext(TransactionsContext, 'RecentTransactionsProvider')
