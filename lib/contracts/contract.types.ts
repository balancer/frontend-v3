import {
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi'
import { Abi, Address } from 'viem'
import { useManagedTransaction } from './useManagedTransaction'
import { ChainId } from '@balancer/sdk'

export type TransactionSimulation =
  | ReturnType<typeof usePrepareContractWrite>
  | ReturnType<typeof usePrepareSendTransaction>
export type TransactionExecution =
  | ReturnType<typeof useContractWrite>
  | ReturnType<typeof useSendTransaction>
export type TransactionResult =
  | ReturnType<typeof useWaitForTransaction>
  | ReturnType<typeof useWaitForTransaction>
export type ManagedTransactionPayload = ReturnType<typeof useManagedTransaction>
export type TransactionBundle = {
  simulation: TransactionSimulation
  execution: TransactionExecution
  result: TransactionResult
}

export type AbiItem = Abi[number]
export type WriteAbiMutability = 'payable' | 'nonpayable'

export type SdkTransactionConfig = {
  account: Address
  chainId: ChainId
  data: Address
  to: Address
  value?: bigint
}

export type UsePrepareSendTransactionConfig = Exclude<
  Parameters<typeof usePrepareSendTransaction>[0],
  undefined
>
