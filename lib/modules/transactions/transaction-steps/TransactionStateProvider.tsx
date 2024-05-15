'use client'

import { createContext, PropsWithChildren, useState } from 'react'
import { ManagedResult } from './lib'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'

export function _useTransactionState() {
  const [transactionMap, setTransactionMap] = useState<Map<string, ManagedResult>>(new Map())

  function updateTransaction(k: string, v: ManagedResult) {
    // if creating transaction
    if (!transactionMap.has(k)) {
      /*
      When there was a previous transaction useWriteContract() will return the execution hash from that previous transaction,
      So we need to reset it to avoid issues with multiple "managedTransaction" steps running in sequence.
      More info: https://wagmi.sh/react/api/hooks/useWriteContract#data
      */
      v.execution.reset()
    }

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
