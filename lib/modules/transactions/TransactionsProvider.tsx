'use client'

import { TransactionInfo } from '@/lib/contracts/contract.types'
import { useMandatoryContext } from '@/lib/utils/contexts'
import React, { ReactNode, createContext, useState } from 'react'

export type RecentTransactionsResponse = ReturnType<typeof _useRecentTransactions>
export const TransactionsContext = createContext<RecentTransactionsResponse | null>(null)

export function _useRecentTransactions() {
  // This is an initial example to show how global transaction handling could work
  // we will need a more complex structure with grouped transactions
  const [transactions, setTransactions] = useState<TransactionInfo[]>([])

  function addTransaction(transactionInfo: TransactionInfo) {
    setTransactions([...transactions, transactionInfo])
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
