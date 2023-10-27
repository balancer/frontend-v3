/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { ManagedResult, TransactionLabels } from '@/components/btns/transaction-steps/lib'
import { useEffect, useState } from 'react'
import { Address, GetFunctionArgs, InferFunctionName } from 'viem'
import {
  UsePrepareContractWriteConfig,
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { useRecentTransactions } from '../modules/transactions/RecentTransactionsProvider'
import { TransactionExecution, TransactionSimulation, WriteAbiMutability } from './contract.types'

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
  const { addTrackedTransaction, updateTrackedTransaction } = useRecentTransactions()
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
  useEffect(() => {
    if (writeQuery.data?.hash) {
      addTrackedTransaction({
        hash: writeQuery.data.hash,
        label: labels.confirming || 'Confirming transaction',
        description: labels.description,
        status: 'confirming',
        timestamp: Date.now(),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [writeQuery.data?.hash])

  // on confirmation
  useEffect(() => {
    if (bundle.result.data?.transactionHash) {
      if (bundle.result.data.status === 'reverted') {
        updateTrackedTransaction(bundle.result.data.transactionHash, {
          label: labels.reverted,
          status: 'reverted',
        })
      } else {
        updateTrackedTransaction(bundle.result.data.transactionHash, {
          label: labels.confirmed,
          status: 'confirmed',
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bundle.result.data?.transactionHash])

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
