/* eslint-disable react-hooks/rules-of-hooks */
'use client'

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
import { useRecentTransactions } from '../modules/transactions/RecentTransactionsProvider'
import { ManagedResult } from '@/components/btns/transaction-steps/lib'

export function useManagedTransaction<
  T extends typeof AbiMap,
  M extends keyof typeof AbiMap,
  F extends InferFunctionName<T[M], string, WriteAbiMutability>
>(
  contractId: M,
  functionName: F,
  args?: GetFunctionArgs<T[M], F> | null,
  additionalConfig?: Omit<
    UsePrepareContractWriteConfig<T[M], F, number>,
    'abi' | 'address' | 'functionName' | 'args'
  >
) {
  const address = useContractAddress(contractId)
  const { addTransaction } = useRecentTransactions()
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
    managedRun: managedWrite,
    managedRunAsync: managedWriteAsync,
  } satisfies ManagedResult
}
