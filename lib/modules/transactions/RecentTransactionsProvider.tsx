'use client'

import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { AlertStatus, ToastId, useToast } from '@chakra-ui/react'
import { keyBy, orderBy, take } from 'lodash'
import React, { ReactNode, createContext, useCallback, useEffect, useState } from 'react'
import { Hash } from 'viem'
import { usePublicClient } from 'wagmi'

export type RecentTransactionsResponse = ReturnType<typeof _useRecentTransactions>
export const TransactionsContext = createContext<RecentTransactionsResponse | null>(null)
const NUM_RECENT_TRANSACTIONS = 5

// confirming = transaction has not been mined
// confirmed = transaction has been mined and is present on chain
// reverted = transaction has been mined and is present on chain - but the execution was reverted
// rejected = transaction was rejected by the rpc / other execution error prior to submission to chain
type TransactionStatus = 'confirming' | 'confirmed' | 'reverted' | 'rejected'

export type TrackedTransaction = {
  hash: Hash
  label?: string
  description?: string
  status: TransactionStatus
  toastId?: ToastId
  timestamp: number
  init?: string
}

type UpdateTrackedTransaction = Pick<TrackedTransaction, 'label' | 'description' | 'status'>

const TransactionStatusToastStatusMapping: Record<TransactionStatus, AlertStatus> = {
  confirmed: 'success',
  confirming: 'loading',
  reverted: 'error',
  rejected: 'error',
}

export function _useRecentTransactions() {
  const [transactions, setTransactions] = useState<Record<string, TrackedTransaction>>({})
  const toast = useToast()
  const publicClient = usePublicClient()

  // when loading transactions from the localStorage cache and we identify any unconfirmed
  // transactions, we should fetch the receipt of the transactions
  const waitForUnconfirmedTransactions = useCallback(
    async (transactions: Record<string, TrackedTransaction>) => {
      const unconfirmedTransactions = Object.values(transactions).filter(
        tx => tx.status === 'confirming'
      )

      const updatePayload = {
        ...transactions,
      }
      // we cannot use a wagmi hook here as useWaitForTransaction does not support a list of hashes
      // nor can we render multiple useWaitForTransaction hooks
      // so we use the underlying viem call to get the transactions confirmation status
      for (const tx of unconfirmedTransactions) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash: tx.hash })
        if (receipt?.status === 'success') {
          updatePayload[tx.hash] = {
            ...tx,
            status: 'confirmed',
          }
        } else {
          updatePayload[tx.hash] = {
            ...tx,
            status: 'reverted',
          }
        }
        setTransactions(updatePayload)
      }
    },
    [publicClient]
  )

  // fetch recent transactions from local storage
  useEffect(() => {
    const _recentTransactions = localStorage.getItem('balancer.recentTransactions')
    if (_recentTransactions) {
      const recentTransactions = JSON.parse(_recentTransactions)
      setTransactions(recentTransactions)
      // confirm the status of any past confirming transactions
      // on load
      waitForUnconfirmedTransactions(recentTransactions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    // keep only the 'n' most recent transactions
    const mostRecentTransactions = keyBy(
      take(
        orderBy(Object.values(updatedTrackedTransactions), 'timestamp', 'desc'),
        NUM_RECENT_TRANSACTIONS
      ),
      'hash'
    )

    setTransactions(mostRecentTransactions)
    updateLocalStorage(updatedTrackedTransactions)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function updateTrackedTransaction(hash: Hash, updatePayload: UpdateTrackedTransaction) {
    // attempt to find this transaction in the cache
    const cachedTransaction = transactions[hash]

    // seems like we couldn't find this transaction in the cache
    // TODO discuss behaviour around this
    if (!cachedTransaction) {
      console.log({ hash, transactions })
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

  function addTrackedTransaction(trackedTransaction: TrackedTransaction) {
    handleTransactionAdded(trackedTransaction)
  }

  return { transactions, addTrackedTransaction, updateTrackedTransaction, setTransactions }
}

export function RecentTransactionsProvider({ children }: { children: ReactNode }) {
  const transactions = _useRecentTransactions()
  return (
    <TransactionsContext.Provider value={transactions}>{children}</TransactionsContext.Provider>
  )
}

export const useRecentTransactions = () =>
  useMandatoryContext(TransactionsContext, 'RecentTransactionsProvider')
