/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ManagedResult, TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect } from 'react'
import { useEstimateGas, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { TransactionExecution, TransactionSimulation, UseEstimateGasConfig } from './contract.types'
import { useOnTransactionConfirmation } from './useOnTransactionConfirmation'
import { useOnTransactionSubmission } from './useOnTransactionSubmission'
import { getGqlChain } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { useChainSwitch } from '../useChainSwitch'
import {
  captureWagmiExecutionError,
  sentryMetaForWagmiExecution,
} from '@/lib/shared/utils/query-errors'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useRecentTransactions } from '../../transactions/RecentTransactionsProvider'

export function useManagedSendTransaction(
  labels: TransactionLabels,
  chainId: SupportedChainId,
  txConfig: UseEstimateGasConfig | undefined,
  gasEstimationMeta?: Record<string, unknown> | undefined
) {
  const { shouldChangeNetwork } = useChainSwitch(chainId)
  const { minConfirmations } = useNetworkConfig()
  const { updateTrackedTransaction } = useRecentTransactions()

  const estimateGasQuery = useEstimateGas({
    ...txConfig,
    chainId,
    query: {
      enabled: !!txConfig && !shouldChangeNetwork,
      meta: gasEstimationMeta,
    },
  })

  const writeQuery = useSendTransaction({
    mutation: {
      meta: sentryMetaForWagmiExecution('Error sending transaction', {
        chainId,
        txConfig,
        estimatedGas: estimateGasQuery.data,
      }),
    },
  })

  const transactionStatusQuery = useWaitForTransactionReceipt({
    chainId,
    hash: writeQuery.data,
    confirmations: minConfirmations,
  })

  const bundle = {
    chainId,
    simulation: estimateGasQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    result: transactionStatusQuery,
  }

  // when the transaction is successfully submitted to the chain
  // start monitoring the hash
  //
  // when the transaction has an execution error, update that within
  // the global transaction cache too
  useEffect(() => {
    if (bundle?.execution?.data) {
      // add transaction here
    }
  }, [bundle.execution?.data])

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
      const txHash = writeQuery.data
      captureWagmiExecutionError(transactionStatusQuery.error, 'Error in useWaitForTransaction', {
        chainId,
        txHash,
      })

      if (txHash) {
        updateTrackedTransaction(txHash, {
          status: 'timeout',
          label: 'Transaction timeout',
          duration: null,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatusQuery.error])

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission({
    labels,
    hash: writeQuery.data,
    chain: getGqlChain(chainId),
  })

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation({
    labels,
    status: bundle.result.data?.status,
    hash: bundle.result.data?.transactionHash,
  })

  const managedSendAsync = async () => {
    if (!estimateGasQuery.data) return
    if (!txConfig?.to) return
    try {
      return writeQuery.sendTransactionAsync({
        chainId,
        to: txConfig.to,
        data: txConfig.data,
        value: txConfig.value,
        gas: estimateGasQuery.data,
      })
    } catch (e: unknown) {
      captureWagmiExecutionError(e, 'Error in send transaction execution', {
        chainId,
        txConfig,
        gas: estimateGasQuery.data,
      })
      throw e
    }
  }

  return {
    ...bundle,
    executeAsync: managedSendAsync,
  } satisfies ManagedResult
}
