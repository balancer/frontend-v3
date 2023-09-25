'use client'

import { TransactionInfo } from '@/lib/contracts/contracts.types'
import { useMandatoryContext } from '@/lib/utils/contexts'
import React, { ReactNode, createContext, useState } from 'react'

export type TransactionsResponse = ReturnType<typeof _useTransactions>
export const TransactionsContext = createContext<TransactionsResponse | null>(null)

export function _useTransactions() {
  // This is an initial example to show how global transaction handling could work
  // we will need a more complex structure with grouped transactions
  const [transactions, setTransactions] = useState<TransactionInfo[]>([])

  function addTransaction(transactionInfo: TransactionInfo) {
    setTransactions([...transactions, transactionInfo])
  }

  return { transactions, addTransaction }
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const transactions = _useTransactions()
  return (
    <TransactionsContext.Provider value={transactions}>{children}</TransactionsContext.Provider>
  )
}

export const useTransactions = () =>
  useMandatoryContext(TransactionsContext, 'TransactionsProvider')
