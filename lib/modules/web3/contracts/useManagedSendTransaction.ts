/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ManagedResult, TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect } from 'react'
import { useEstimateGas, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi'
import { TransactionConfig, TransactionExecution, TransactionSimulation } from './contract.types'
import { useChainSwitch } from '../useChainSwitch'
import {
  captureWagmiExecutionError,
  sentryMetaForWagmiExecution,
} from '@/lib/shared/utils/query-errors'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { mainnet } from 'viem/chains'
import { useTxHash } from '../safe.hooks'
import { getWaitForReceiptTimeout } from './wagmi-helpers'
import { useTransactionState } from '../../transactions/transaction-steps/TransactionStateProvider'
import { useOnTransactionSubmission } from './useOnTransactionSubmission'
import { getGqlChain } from '@/lib/config/app.config'
import { useOnTransactionConfirmation } from './useOnTransactionConfirmation'

export type ManagedSendTransactionInput = {
  labels: TransactionLabels
  txConfig?: TransactionConfig
  gasEstimationMeta?: Record<string, unknown>
}

export function useManagedSendTransaction({
  labels,
  txConfig,
  gasEstimationMeta,
}: ManagedSendTransactionInput) {
  // chainId will always have the correct value as the transaction is disabled when txConfig is undefined
  const chainId = txConfig?.chainId || mainnet.id
  const { shouldChangeNetwork } = useChainSwitch(chainId)
  const { minConfirmations } = useNetworkConfig()
  const { recentTransactions } = useTransactionState()

  const estimateGasQuery = useEstimateGas({
    ...txConfig,
    query: {
      enabled: !!txConfig && !shouldChangeNetwork,
      meta: gasEstimationMeta,
      refetchOnWindowFocus: false,
    },
  })

  const writeQuery = useSendTransaction({
    mutation: {
      meta: sentryMetaForWagmiExecution('Error sending transaction', {
        txConfig,
        estimatedGas: estimateGasQuery.data,
      }),
    },
  })

  const { txHash, isSafeTxLoading } = useTxHash({ chainId, wagmiTxHash: writeQuery.data })

  const transactionStatusQuery = useWaitForTransactionReceipt({
    chainId,
    hash: txHash,
    confirmations: minConfirmations,
    timeout: getWaitForReceiptTimeout(chainId),
  })

  const bundle = {
    chainId,
    simulation: estimateGasQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    result: transactionStatusQuery,
    isSafeTxLoading,
  }

  useEffect(() => {
    if (transactionStatusQuery.error) {
      if (txHash) {
        recentTransactions.updateTrackedTransaction(txHash, {
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
    hash: txHash,
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
