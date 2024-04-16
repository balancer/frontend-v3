/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ManagedResult, TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect } from 'react'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'
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
import { captureWagmiExecutionError } from '@/lib/shared/utils/query-errors'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useRecentTransactions } from '../../transactions/RecentTransactionsProvider'
import { useWaitForTransaction } from './useWaitForTransaction'

export function useManagedSendTransaction(
  labels: TransactionLabels,
  chainId: SupportedChainId,
  txConfig: UsePrepareSendTransactionConfig | undefined,
  onSimulationError?: (error: unknown) => void
) {
  const { shouldChangeNetwork } = useChainSwitch(chainId)
  const { minConfirmations } = useNetworkConfig()
  const { updateTrackedTransaction } = useRecentTransactions()

  const prepareQuery = usePrepareSendTransaction({
    ...txConfig,
    chainId,
    enabled: !!txConfig && !shouldChangeNetwork,
    onError: onSimulationError,
  })

  const writeQuery = useSendTransaction({
    chainId: txConfig?.chainId,
    ...prepareQuery.config,
    onError: (error: unknown) => {
      captureWagmiExecutionError(error, 'Error sending transaction', prepareQuery.config)
    },
  })

  const transactionStatusQuery = useWaitForTransaction({
    hash: writeQuery.data?.hash,
    confirmations: minConfirmations,
  })

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

  useEffect(() => {
    if (transactionStatusQuery.error) {
      const txHash = writeQuery.data?.hash
      captureWagmiExecutionError(transactionStatusQuery.error, 'Error in useWaitForTransaction', {
        chainId,
        txHash,
      })

      if (txHash) {
        updateTrackedTransaction(txHash, {
          status: 'timeout',
          label: 'Unexpected receipt timeout',
          duration: null,
          description:
            // eslint-disable-next-line max-len
            `An unexpected timeout occurred while waiting for the receipt of your transaction.
However the transaction appears to have been executed.
Click on the following link to verify the tx state in the tx explorer.`,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatusQuery.error])

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
