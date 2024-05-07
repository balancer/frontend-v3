/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { getGqlChain } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { ManagedResult, TransactionLabels } from '@/lib/modules/transactions/transaction-steps/lib'
import { useEffect, useState } from 'react'
import { Abi, ContractFunctionArgs, ContractFunctionName } from 'viem'
import {
  UseSimulateContractParameters,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi'
import { useChainSwitch } from '../useChainSwitch'
import { AbiMap } from './AbiMap'
import { TransactionExecution, TransactionSimulation, WriteAbiMutability } from './contract.types'
import { useOnTransactionConfirmation } from './useOnTransactionConfirmation'
import { useOnTransactionSubmission } from './useOnTransactionSubmission'
import { captureWagmiExecutionError } from '@/lib/shared/utils/query-errors'

type IAbiMap = typeof AbiMap
type AbiMapKey = keyof typeof AbiMap

type AdditionalConfig = Omit<
  UseSimulateContractParameters<
    (typeof AbiMap)[keyof typeof AbiMap],
    ContractFunctionName<(typeof AbiMap)[keyof typeof AbiMap], WriteAbiMutability>
  >,
  'abi' | 'address' | 'functionName' | 'args'
>

export interface ManagedTransactionInput {
  contractAddress: string
  contractId: AbiMapKey
  functionName: ContractFunctionName<IAbiMap[AbiMapKey], WriteAbiMutability>
  labels: TransactionLabels
  chainId: SupportedChainId
  args?: ContractFunctionArgs<IAbiMap[AbiMapKey], WriteAbiMutability> | null
  additionalConfig?: AdditionalConfig
}

export function useManagedTransaction({
  contractAddress,
  contractId,
  functionName,
  labels,
  chainId,
  args,
  additionalConfig,
}: ManagedTransactionInput) {
  const [writeArgs, setWriteArgs] = useState(args)
  const { minConfirmations } = useNetworkConfig()
  const { shouldChangeNetwork } = useChainSwitch(chainId)

  const enabled = additionalConfig?.query?.enabled ?? true

  const simulateQuery = useSimulateContract({
    abi: AbiMap[contractId] as Abi,
    address: contractAddress,
    functionName: functionName as ContractFunctionName<any, WriteAbiMutability>,
    // This any is 'safe'. The type provided to any is the same type for args that is inferred via the functionName
    args: writeArgs as any,
    ...(additionalConfig as any),
    chainId,
    query: {
      enabled: enabled && !shouldChangeNetwork,
      meta: additionalConfig?.query?.meta,
    },
  })

  const writeQuery = useWriteContract()

  const transactionStatusQuery = useWaitForTransactionReceipt({
    chainId,
    hash: writeQuery.data,
    confirmations: minConfirmations,
  })
  const bundle = {
    chainId,
    simulation: simulateQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    result: transactionStatusQuery,
  }

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission({
    labels,
    hash: writeQuery.data,
    chain: getGqlChain(chainId as SupportedChainId),
  })

  // on confirmation, update tx in tx cache
  useOnTransactionConfirmation({
    labels,
    status: bundle.result.data?.status,
    hash: bundle.result.data?.transactionHash,
  })

  // if parent changes args, update here
  useEffect(() => {
    setWriteArgs(args)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(args)])

  const managedWriteAsync = async (
    args?: ContractFunctionArgs<IAbiMap[AbiMapKey], WriteAbiMutability>
  ) => {
    if (args) {
      setWriteArgs(args)
    }
    if (!simulateQuery.data) return
    try {
      await writeQuery.writeContractAsync({
        ...simulateQuery.data.request,
        chainId: chainId,
      })
    } catch (e: unknown) {
      captureWagmiExecutionError(e, 'Error in managed transaction execution', {
        chainId,
        request: simulateQuery.data.request,
      })
      throw e
    }
  }

  return {
    ...bundle,
    executeAsync: managedWriteAsync,
  } satisfies ManagedResult
}
