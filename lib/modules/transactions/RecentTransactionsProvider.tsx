'use client'

import { TransactionBundle } from '@/lib/contracts/contract.types'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { AlertStatus, ToastId, useToast } from '@chakra-ui/react'
import React, { ReactNode, createContext, useEffect, useState } from 'react'
import { Hash } from 'viem'

export type RecentTransactionsResponse = ReturnType<typeof _useRecentTransactions>
export const TransactionsContext = createContext<RecentTransactionsResponse | null>(null)

type TransactionStatus = 'confirming' | 'confirmed' | 'reverted'

type TrackedTransaction = {
  hash: Hash
  label?: string
  description?: string
  status: TransactionStatus
  toastId?: ToastId
}

type UpdateTrackedTransaction = Pick<TrackedTransaction, 'label' | 'description' | 'status'>

const TransactionStatusToastStatusMapping: Record<TransactionStatus, AlertStatus> = {
  confirmed: 'success',
  confirming: 'loading',
  reverted: 'error',
}

export function _useRecentTransactions() {
  // This is an initial example to show how global transaction handling could work
  // we will need a more complex structure with grouped transactions
  const [transactions, setTransactions] = useState<Record<string, TrackedTransaction>>({})
  const toast = useToast()

  // fetch recent transactions from local storage
  useEffect(() => {
    const recentTransactions = localStorage.getItem('balancer.recentTransactions')
    if (recentTransactions) {
      setTransactions(JSON.parse(recentTransactions))
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleTransactionAdded(trackedTransaction: TrackedTransaction) {
    // add a toast for this transaction, rather than emitting a new toast
    // on updates for the same transaction, we will modify the same toast
    // using updateTrackedTransaction.
    const toastId = toast({
      title: trackedTransaction.label,
      description: trackedTransaction.description,
      status: 'loading',
      duration: null,
      isClosable: true,
    })

    if (!trackedTransaction.hash) {
      throw new Error('Attempted to add a transaction to the cache without a hash.')
    }
    // Make sure to store a reference to the toast on this transaction
    const updatedTrackedTransactions = {
      ...transactions,
      [trackedTransaction.hash]: { ...trackedTransaction, toastId },
    }
    setTransactions(updatedTrackedTransactions)
    updateLocalStorage(updatedTrackedTransactions)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateTrackedTransaction(hash: Hash, updatePayload: UpdateTrackedTransaction) {
    // attempt to find this transaction in the cache
    const cachedTransaction = transactions[hash]

    // seems like we couldn't find this transaction in the cache
    // TODO discuss behaviour around this
    if (!cachedTransaction) {
      throw new Error('Cannot update a cached tracked transaction that does not exist.')
    }

    const updatedCachedTransaction = {
      ...cachedTransaction,
      ...updatePayload,
    }

    const updatedCache = {
      ...transactions,
      [hash]: updatedCachedTransaction,
    }

    setTransactions(updatedCache)
    updateLocalStorage(updatedCache)

    // update the relevant toast too
    if (updatedCachedTransaction.toastId) {
      toast.update(updatedCachedTransaction.toastId, {
        status: TransactionStatusToastStatusMapping[updatePayload.status],
        title: updatedCachedTransaction.label,
        description: updatedCachedTransaction.description,
        isClosable: true,
        duration: 5000,
      })
    }
  }

  function updateLocalStorage(customUpdate?: Record<string, TrackedTransaction>) {
    localStorage.setItem(
      'balancer.recentTransactions',
      JSON.stringify(customUpdate || transactions)
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function handleTransactionConfirmation(_bundle: TransactionBundle) {
    //Non empty function
  }

  function addTrackedTransaction(trackedTransaction: TrackedTransaction) {
    handleTransactionAdded(trackedTransaction)
  }

  return { transactions, addTrackedTransaction, updateTrackedTransaction }
}

export function RecentTransactionsProvider({ children }: { children: ReactNode }) {
  const transactions = _useRecentTransactions()
  return (
    <TransactionsContext.Provider value={transactions}>{children}</TransactionsContext.Provider>
  )
}

export const useRecentTransactions = () =>
  useMandatoryContext(TransactionsContext, 'RecentTransactionsProvider')
