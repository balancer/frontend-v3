/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import {
  ManagedResult,
  TransactionLabels,
} from '@/lib/shared/components/btns/transaction-steps/lib'
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
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { usdtAbi } from './abi/UsdtAbi'
import { getGqlChain } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'

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
  const { minConfirmations } = useNetworkConfig()

  const usdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'
  const isUsdt = isSameAddress(tokenAddress, usdtAddress)

  const prepareQuery = usePrepareContractWrite({
    /*
      USDTs ABI does not exactly follow the erc20ABI so we need its explicit ABI to avoid errors (e.g. calling approve)
      More info: https://github.com/wevm/wagmi/issues/2749#issuecomment-1638200817
    */
    abi: isUsdt ? usdtAbi : erc20ABI,
    address: tokenAddress,
    functionName: functionName as InferFunctionName<any, string, WriteAbiMutability>,
    // This any is 'safe'. The type provided to any is the same type for args that is inferred via the functionName
    args: writeArgs?.args as any,
    ...(additionalConfig as any),
  })

  const writeQuery = useContractWrite(prepareQuery.config)
  const transactionStatusQuery = useWaitForTransaction({
    hash: writeQuery.data?.hash,
    confirmations: minConfirmations,
  })

  const bundle = {
    simulation: prepareQuery as TransactionSimulation,
    execution: writeQuery as TransactionExecution,
    result: transactionStatusQuery,
  }

  // on successful submission to chain, add tx to cache
  useOnTransactionSubmission({
    labels,
    hash: writeQuery.data?.hash,
    chain: getGqlChain((writeQuery.variables?.chainId || 1) as SupportedChainId),
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
