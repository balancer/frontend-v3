/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { Abi, GetFunctionArgs, InferFunctionName } from 'viem'
import { vaultABI } from '../abi/generated'
import { useEffect, useState } from 'react'
import { useNetworkConfig } from '../config/useNetworkConfig'
import { get } from 'lodash'
import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

type WriteAbiMutability = 'payable' | 'nonpayable'

const GeneratedABIMap = {
  'balancer.vault': vaultABI,
}

export function useContractAddress(contractId: string) {
  const networkConfig = useNetworkConfig()

  const address = get(networkConfig.contracts, contractId)
  return address
}

export function useManagedTransaction<
  T extends typeof GeneratedABIMap,
  M extends keyof typeof GeneratedABIMap
>(
  contractId: M,
  functionName: InferFunctionName<T[M], string, WriteAbiMutability>,
  args?: GetFunctionArgs<T[M], InferFunctionName<T[M], string, WriteAbiMutability>>
) {
  const address = useContractAddress(contractId)
  const [writeArgs, setWriteArgs] = useState(args)

  const prepareQuery = usePrepareContractWrite({
    abi: GeneratedABIMap[contractId] as Abi,
    address,
    functionName: functionName as InferFunctionName<typeof vaultABI, string, WriteAbiMutability>,
    // This any is 'safe'. The type provided to any is the same type for args that is inferred via the functionName
    args: writeArgs as any,
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
  }, [JSON.stringify(args)])

  const managedWrite = (
    args?: GetFunctionArgs<T[M], InferFunctionName<T[M], string, WriteAbiMutability>>
  ) => {
    if (args) {
      setWriteArgs(args)
    }
    writeQuery.write?.()
  }

  const managedWriteAsync = async (
    args?: GetFunctionArgs<T[M], InferFunctionName<T[M], string, WriteAbiMutability>>
  ) => {
    if (args) {
      setWriteArgs(args)
    }
    return await writeQuery.writeAsync?.()
  }

  return {
    txStatus: transactionStatusQuery,
    simulate: prepareQuery,
    ...writeQuery,
    write: managedWrite,
    writeAsync: managedWriteAsync,
  }
}
