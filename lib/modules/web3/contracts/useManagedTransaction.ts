/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import {
  ManagedResult,
  TransactionLabels,
} from '@/lib/shared/components/btns/transaction-steps/lib'
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
import { useContractAddress } from './useContractAddress'
import { useOnTransactionConfirmation } from './useOnTransactionConfirmation'
import { useOnTransactionSubmission } from './useOnTransactionSubmission'

export function useManagedTransaction<
  T extends typeof AbiMap,
  M extends keyof typeof AbiMap,
  F extends InferFunctionName<T[M], string, WriteAbiMutability>
>(
  contractId: M,
  functionName: F,
  transactionLabels: TransactionLabels,
  args?: GetFunctionArgs<T[M], F> | null,
  additionalConfig?: Omit<
    UsePrepareContractWriteConfig<T[M], F, number>,
    'abi' | 'address' | 'functionName' | 'args'
  >
) {
  const address = useContractAddress(contractId)
  const [writeArgs, setWriteArgs] = useState(args)

  const prepareQuery = usePrepareContractWrite({
    abi: AbiMap[contractId] as Abi,
    address,
    functionName: functionName as InferFunctionName<any, string, WriteAbiMutability>,
    // This any is 'safe'. The type provided to any is the same type for args that is inferred via the functionName
    args: writeArgs?.args as any,
    ...(additionalConfig as any),
  })

  const writeQuery = useContractWrite(prepareQuery.config)
  const transactionStatusQuery = useWaitForTransaction({ hash: writeQuery.data?.hash })
  const bundle = {
    simulation: prepareQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    result: transactionStatusQuery,
  }

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission(transactionLabels, writeQuery.data?.hash)

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation(
    transactionLabels,
    bundle.result.data?.status,
    bundle.result.data?.transactionHash
  )

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
