/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { PublicClient, WalletClient, useMutation, usePublicClient } from 'wagmi'
import { useNetworkConfig } from '../config/useNetworkConfig'
import { get } from 'lodash'
import { useQuery } from '@tanstack/react-query'
import { Hash, TransactionReceipt } from 'viem'
import { useToast } from '@chakra-ui/react'

export function getContractConfig(contractPath: string, walletClient?: WalletClient) {
  const networkConfig = useNetworkConfig()
  const publicClient = usePublicClient()
  const address = get(networkConfig.contracts, contractPath)
  if (walletClient) {
    return {
      address,
      publicClient,
      walletClient,
    }
  }

  return {
    address,
    publicClient,
  }
}

// Create a type that maps method names to argument types
type ArgumentsType<T> = T extends (...args: infer U) => any ? U : never
type MutableTuple<T extends readonly any[]> = { -readonly [P in keyof T]: T[P] }
type AnyFunction = (...args: any[]) => any
type FunctionMap = Record<string, AnyFunction>

export function useContractQuery<M extends FunctionMap>(contractId: string, contract: { read: M }) {
  type TReadMethods = keyof typeof contract.read

  function getQuery<K extends TReadMethods>(
    functionName: K,
    functionArgs?: MutableTuple<ArgumentsType<(typeof contract.read)[K]>>
  ) {
    const callable = contract.read[functionName] as (
      ...args: any[]
    ) => ReturnType<(typeof contract.read)[K]>
    const query = useQuery<ReturnType<(typeof contract.read)[K]>>({
      queryKey: [contractId, { ...functionArgs }],
      queryFn: async () => {
        return callable(...(functionArgs as any[]))
      },
    })
    return query
  }

  return getQuery
}

async function confirmTransaction(
  publicClient: PublicClient,
  hash: Hash,
  minConfirmations: number
) {
  // 1. retrieve receipt
  try {
    const transactionReceipt = await publicClient.getTransactionReceipt({
      hash,
    })
    if (!transactionReceipt) {
      throw new Error(`Transaction ${hash} was submitted on-chain but no receipt was found.`)
    }

    // 2. confirm the transaction
    const isConfirmed = false
    while (!isConfirmed) {
      try {
        const confirmations = await publicClient.getTransactionConfirmations({
          transactionReceipt,
        })
        if (confirmations >= minConfirmations) {
          break
        }
      } catch (confirmationError) {
        throw new Error(`Failed to confirm ${hash}. ${confirmationError}`)
      }
    }
    // 3. on confirmation, return the receipt
    return transactionReceipt
  } catch (receiptError) {
    throw new Error(`Failed to retrieve transaction receipt for ${hash}. ${receiptError}`)
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useContractMutation<T, M>(contractId: string, contract: { write: M }) {
  const networkConfig = useNetworkConfig()
  const publicClient = usePublicClient()
  const toast = useToast()
  type TWriteMethods = keyof typeof contract.write

  function getMutation<K extends TWriteMethods>(
    functionName: K,
    functionArgs: MutableTuple<ArgumentsType<(typeof contract.write)[K]>>
  ) {
    const callable = contract.write[functionName] as (...args: any[]) => Promise<Hash>
    const query = useMutation<TransactionReceipt>({
      mutationKey: [contractId, { ...functionArgs, functionName }],
      mutationFn: async () => {
        const hash: Hash = await callable(...(functionArgs as any[]))
        toast({
          title: 'Transaction sent',
          description: 'Transaction sent',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        const transactionReceipt = await confirmTransaction(
          publicClient,
          hash,
          networkConfig.minConfirmations
        )
        toast({
          title: 'Confirming transaction',
          description: 'Confirming transaction',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
        return transactionReceipt
      },
      onSuccess: () => {
        toast({
          title: 'Transaction confirmed',
          description: 'Transaction confirmed description',
          status: 'success',
          duration: 2000,
          isClosable: true,
        })
      },
      onError: error => {
        toast({
          title: 'Transaction error',
          description: 'Transaction error',
          status: 'error',
          duration: 2000,
          isClosable: true,
        })
        console.error(`Transaction failed. ${error}`)
      },
    })
    return query
  }

  return getMutation
}
