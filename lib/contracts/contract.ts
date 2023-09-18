/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { WalletClient, usePublicClient } from 'wagmi'
import { useNetworkConfig } from '../config/useNetworkConfig'
import { get } from 'lodash'
import { useQuery } from '@tanstack/react-query'

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
