/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { useEffect, useState } from 'react'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import { useRecentTransactions } from '../modules/transactions/RecentTransactionsProvider'
import {
  TransactionExecution,
  TransactionSimulation,
  UsePrepareSendTransactionConfig as UsePrepareSendTransactionConfig,
} from './contract.types'

export function useManagedSendTransaction(config: UsePrepareSendTransactionConfig) {
  const { addTransaction } = useRecentTransactions()
  const [txConfig, setTxConfig] = useState(config)

  const prepareQuery = usePrepareSendTransaction(txConfig)

  const writeQuery = useSendTransaction({
    chainId: txConfig?.chainId,
    ...prepareQuery.config,
  })

  const transactionStatusQuery = useWaitForTransaction({ hash: writeQuery.data?.hash })

  const bundle = {
    simulation: prepareQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    result: transactionStatusQuery,
  }

  // when the transaction is successfully submitted to the chain
  // start monitoring the hash
  //
  // when the transaction has an execution error, update that within
  // the global transaction cache too
  useEffect(() => {
    if (bundle?.execution?.data?.hash) {
      // add transaction here
    }
  }, [bundle.execution?.data?.hash])

  // when the transaction has an execution error, update that within
  // the global transaction cache
  // this can either be an execution error or a confirmation error
  useEffect(() => {
    if (bundle?.execution?.error) {
      // monitor execution error here
    }
    if (bundle?.result?.error) {
      // monitor confirmation error here
    }
  }, [bundle.execution?.error, bundle.result?.error])

  // on successful submission to chain, add tx to cache
  useEffect(() => {
    if (writeQuery.data?.hash) {
      addTransaction(bundle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeQuery.data?.hash])

  // if parent changes args, update here
  useEffect(() => {
    setTxConfig(txConfig)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(txConfig)])

  return {
    ...bundle,
    sendTransaction: writeQuery.sendTransaction,
    sendTransactionAsync: writeQuery.sendTransactionAsync,
    setTxConfig,
  }
}
