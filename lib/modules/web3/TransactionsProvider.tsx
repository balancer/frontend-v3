'use client'

import { TransactionInfo } from '@/lib/contracts/useGualisWriteContract'
import React, { ReactNode, createContext, useContext, useState } from 'react'

export type TransactionsResponse = ReturnType<typeof _useTransactions>
export const TransactionsContext = createContext<TransactionsResponse | null>(null)

export function _useTransactions() {
  // TODO: add proper TS types
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

// useMandatoryContext
export const useTransactions = () => useContext(TransactionsContext) as TransactionsResponse

// import {
//   TransactionReceipt,
//   TransactionResponse,
// } from '@ethersproject/abstract-provider';

// export type TransactionError = {
//   title: string;
//   description?: string;
// };

// export type TransactionActionState = {
//   init: boolean;
//   confirming: boolean;
//   confirmed: boolean;
//   confirmedAt: string;
//   error?: TransactionError | null;
//   receipt?: TransactionReceipt;
// };

// export type TransactionActionInfo = {
//   label: string;
//   loadingLabel: string;
//   confirmingLabel: string;
//   stepTooltip: string;
//   action: () => Promise<TransactionResponse>;
//   postActionValidation?: () => Promise<boolean>;
//   actionInvalidReason?: TransactionError;
//   isSignAction?: boolean;
//   isStakeAction?: boolean;
//   isUnstakeAction?: boolean;
// };
