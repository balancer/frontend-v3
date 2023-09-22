'use client'

import React, { ReactNode, createContext, useContext, useState } from 'react'

export type TransactionsResponse = ReturnType<typeof _useTransactions>
export const TransactionsContext = createContext<TransactionsResponse | null>(null)

export function _useTransactions() {
  // TODO: add proper TS types
  const [transactions, setTransactions] = useState([])

  return { transactions, setTransactions }
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const transactions = _useTransactions()
  return (
    <TransactionsContext.Provider value={transactions}>{children}</TransactionsContext.Provider>
  )
}

export const useTransactions = () => useContext(TransactionsContext) as TransactionsResponse
