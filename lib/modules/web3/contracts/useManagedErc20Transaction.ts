/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ManagedResult, TransactionLabels } from '@/lib/shared/components/btns/transaction-steps/lib'
import { useEffect, useState } from 'react'
import { Address, GetFunctionArgs, InferFunctionName } from 'viem'
import {
  UsePrepareContractWriteConfig,
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { TransactionExecution, TransactionSimulation, WriteAbiMutability } from './contract.types'
import { useOnTransactionConfirmation } from './useOnTransactionConfirmation'
import { useOnTransactionSubmission } from './useOnTransactionSubmission'

type Erc20Abi = typeof erc20ABI
export function useManagedErc20Transaction<
  F extends InferFunctionName<Erc20Abi, string, WriteAbiMutability>
>(
  tokenAddress: Address,
  functionName: F,
  labels: TransactionLabels,
  args?: GetFunctionArgs<Erc20Abi, F> | null,
  additionalConfig?: Omit<
    UsePrepareContractWriteConfig<Erc20Abi, F, number>,
    'abi' | 'address' | 'functionName' | 'args'
  >
) {
  const [writeArgs, setWriteArgs] = useState(args)

  const prepareQuery = usePrepareContractWrite({
    abi: erc20ABI,
    address: tokenAddress,
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
  useOnTransactionSubmission(labels, writeQuery.data?.hash)

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation(
    labels,
    bundle.result.data?.status,
    bundle.result.data?.transactionHash
  )

  // if parent changes args, update here
  useEffect(() => {
    setWriteArgs(args)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)])

  const managedWrite = (args?: GetFunctionArgs<Erc20Abi, F>) => {
    if (args) {
      setWriteArgs(args)
    }
    writeQuery.write?.()
  }

  const managedWriteAsync = async (args?: GetFunctionArgs<Erc20Abi, F>) => {
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
