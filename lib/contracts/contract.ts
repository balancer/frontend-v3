/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { Abi, GetFunctionArgs, InferFunctionName } from 'viem'
import { useEffect, useState } from 'react'
import { useNetworkConfig } from '../config/useNetworkConfig'
import { get } from 'lodash'
import {
  UsePrepareContractWriteConfig,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from 'wagmi'
import { WriteAbiMutability } from './contract.types'
import { AbiMap } from './AbiMap'
import { TransactionExecution, TransactionSimulation } from './contracts.types'

export function useContractAddress(contractId: string) {
  const networkConfig = useNetworkConfig()

  const address = get(networkConfig.contracts, contractId)
  return address
}

export function useManagedTransaction<
  T extends typeof AbiMap,
  M extends keyof typeof AbiMap,
  F extends InferFunctionName<T[M], string, WriteAbiMutability>
>(
  contractId: M,
  functionName: F,
  args?: GetFunctionArgs<T[M], F>,
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

  // on successful submission to chain, add tx to cache
  useEffect(() => {
    if (writeQuery.data?.hash) {
      // addTransaction(writeQuery.data?.hash)
    }
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
    return writeQuery.write?.()
  }

  const managedWriteAsync = async (args?: GetFunctionArgs<T[M], F>) => {
    if (args) {
      setWriteArgs(args)
    }
    return await writeQuery.writeAsync?.()
  }

  return {
    txStatus: transactionStatusQuery,
    simulation: prepareQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    //TODO: should we move inside execution and change execution type in contract types?
    managedWrite,
    managedWriteAsync,
  }
}
