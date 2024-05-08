'use client'

import { createContext, PropsWithChildren, useState } from 'react'
import { ManagedResult } from './lib'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'

export function _useTransactionState() {
  const [transactionMap, setTransactionMap] = useState<Map<string, ManagedResult>>(new Map())

  function updateTransaction(k: string, v: ManagedResult) {
    setTransactionMap(new Map(transactionMap.set(k, v)))
  }

  function getTransaction(id: string) {
    return transactionMap.get(id)
  }

  return {
    getTransaction,
    updateTransaction,
  }
}

export type TransactionStateResponse = ReturnType<typeof _useTransactionState>
export const TransactionStateContext = createContext<TransactionStateResponse | null>(null)

export function TransactionStateProvider({ children }: PropsWithChildren) {
  const hook = _useTransactionState()

  return (
    <TransactionStateContext.Provider value={hook}>{children}</TransactionStateContext.Provider>
  )
}

export const useTransactionState = (): TransactionStateResponse =>
  useMandatoryContext(TransactionStateContext, 'TransactionState')
