'use client'

import { createContext, PropsWithChildren, useState } from 'react'
import { ManagedResult } from './lib'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'

export function _useTransactionMap() {
  const [transactionMap, setTransactionMap] = useState<Map<string, ManagedResult>>(new Map())

  function updateTransactionMap(k: string, v: ManagedResult) {
    setTransactionMap(new Map(transactionMap.set(k, v)))
  }

  function getTransaction(id: string) {
    return transactionMap.get(id)
  }

  return {
    getTransaction,
    updateTransactionMap,
  }
}

export type Result = ReturnType<typeof _useTransactionMap>
export const TransactionContext = createContext<Result | null>(null)

export function TransactionMapProvider({ children }: PropsWithChildren) {
  const hook = _useTransactionMap()

  return <TransactionContext.Provider value={hook}>{children}</TransactionContext.Provider>
}

export const useTransactionMap = (): Result =>
  useMandatoryContext(TransactionContext, 'Transaction')
