/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ManagedResult, TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect, useState } from 'react'
import { Abi, GetFunctionArgs, InferFunctionName } from 'viem'
import {
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { AbiMap } from './AbiMap'
import { TransactionExecution, TransactionSimulation, WriteAbiMutability } from './contract.types'
import { useOnTransactionConfirmation } from './useOnTransactionConfirmation'
import { useOnTransactionSubmission } from './useOnTransactionSubmission'
import { getGqlChain } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { useChainSwitch } from '../useChainSwitch'
import { captureWagmiExecutionError } from '@/lib/shared/utils/query-errors'

export function useManagedTransaction<
  T extends typeof AbiMap,
  M extends keyof typeof AbiMap,
  F extends InferFunctionName<T[M], string, WriteAbiMutability>
>(
  contractAddress: string,
  contractId: M,
  functionName: F,
  transactionLabels: TransactionLabels,
  chainId: SupportedChainId,
  args?: GetFunctionArgs<T[M], F> | null,
  additionalConfig?: Omit<
    UsePrepareContractWriteConfig<T[M], F, number>,
    'abi' | 'address' | 'functionName' | 'args'
  >
) {
  const [writeArgs, setWriteArgs] = useState(args)
  const { minConfirmations } = useNetworkConfig()
  const { shouldChangeNetwork } = useChainSwitch(chainId)

  const prepareQuery = usePrepareContractWrite({
    abi: AbiMap[contractId] as Abi,
    address: contractAddress,
    functionName: functionName as InferFunctionName<any, string, WriteAbiMutability>,
    // This any is 'safe'. The type provided to any is the same type for args that is inferred via the functionName
    args: writeArgs?.args as any,
    ...(additionalConfig as any),
    chainId,
    enabled: additionalConfig?.enabled && !shouldChangeNetwork,
  })

  const writeQuery = useContractWrite({
    ...prepareQuery.config,
    onError: (error: unknown) => {
      captureWagmiExecutionError(
        error,
        'Error in managed transaction execution',
        prepareQuery.config.request
      )
    },
  })
  const transactionStatusQuery = useWaitForTransaction({
    hash: writeQuery.data?.hash,
    confirmations: minConfirmations,
  })
  const bundle = {
    simulation: prepareQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    result: transactionStatusQuery,
  }

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission({
    labels: transactionLabels,
    hash: writeQuery.data?.hash,
    chain: getGqlChain((writeQuery.variables?.chainId || 1) as SupportedChainId),
  })

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation({
    labels: transactionLabels,
    status: bundle.result.data?.status,
    hash: bundle.result.data?.transactionHash,
  })

  // if parent changes args, update here
  useEffect(() => {
    setWriteArgs(args)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)])

  const managedWrite = (args?: GetFunctionArgs<T[M], F>) => {
    if (args) {
      setWriteArgs(args)
    }
    writeQuery.write?.()
  }

  const managedWriteAsync = async (args?: GetFunctionArgs<T[M], F>) => {
    if (args) {
      setWriteArgs(args)
    }
    await writeQuery.writeAsync?.()
  }

  return {
    ...bundle,
    execute: managedWrite,
    executeAsync: managedWriteAsync,
  } satisfies ManagedResult
}
