/* eslint-disable react-hooks/rules-of-hooks */
'use client'
import { get } from 'lodash'
import { useNetworkConfig } from '../config/useNetworkConfig'
import { usePrepareVaultWrite, useVaultWrite, vaultABI } from '../abi/generated'
import { GetFunctionArgs, InferFunctionName } from 'viem'
import { useWaitForTransaction } from 'wagmi'
import { useEffect, useState } from 'react'

const contractId = 'balancer.vault'

export function useVaultContractAddress() {
  const networkConfig = useNetworkConfig()

  const address = get(networkConfig.contracts, contractId)
  return address
}

type WriteAbiMutability = 'payable' | 'nonpayable'

export function useManagedVaultWrite<
  T extends InferFunctionName<typeof vaultABI, string, WriteAbiMutability>
>(functionName: T, args?: GetFunctionArgs<typeof vaultABI, T>) {
  // const { addTransaction } = useTrackTransaction();

  const [writeArgs, setWriteArgs] = useState(args)

  const address = useVaultContractAddress()
  const prepareQuery = usePrepareVaultWrite({
    address,
    functionName: functionName as InferFunctionName<typeof vaultABI, string, WriteAbiMutability>,
    // This any is 'safe'. The type provided to any is the same type for args that is inferred via the functionName
    args: writeArgs as any,
  })

  const writeQuery = useVaultWrite(prepareQuery.config)
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

  const managedWrite = (args?: GetFunctionArgs<typeof vaultABI, T>) => {
    if (args) {
      setWriteArgs(args)
    }
    writeQuery.write?.()
  }

  const managedWriteAsync = async (args?: GetFunctionArgs<typeof vaultABI, T>) => {
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
