/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ManagedResult, TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect } from 'react'
import { usePrepareSendTransaction, useSendTransaction, useWaitForTransaction } from 'wagmi'
import {
  TransactionExecution,
  TransactionSimulation,
  UsePrepareSendTransactionConfig,
} from './contract.types'
import { useOnTransactionConfirmation } from './useOnTransactionConfirmation'
import { useOnTransactionSubmission } from './useOnTransactionSubmission'
import { getGqlChain } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { useChainSwitch } from '../useChainSwitch'

export function useManagedSendTransaction(
  labels: TransactionLabels,
  chainId: SupportedChainId,
  txConfig?: UsePrepareSendTransactionConfig
) {
  const { shouldChangeNetwork } = useChainSwitch(chainId)

  const prepareQuery = usePrepareSendTransaction({
    ...txConfig,
    chainId,
    enabled: !!txConfig && !shouldChangeNetwork,
  })

  const writeQuery = useSendTransaction({
    chainId: txConfig?.chainId,
    ...prepareQuery.config,
  })

  const transactionStatusQuery = useWaitForTransaction({ hash: writeQuery.data?.hash })

  const bundle = {
    simulation: {
      ...prepareQuery,
      config: { ...prepareQuery.config, chainId },
    } as TransactionSimulation,
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
  useOnTransactionSubmission({
    labels,
    hash: writeQuery.data?.hash,
    chain: getGqlChain((writeQuery.variables?.chainId || 1) as SupportedChainId),
  })

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation({
    labels,
    status: bundle.result.data?.status,
    hash: bundle.result.data?.transactionHash,
  })

  return {
    ...bundle,
    execute: writeQuery.sendTransaction,
    executeAsync: writeQuery.sendTransactionAsync,
  } satisfies ManagedResult
}
