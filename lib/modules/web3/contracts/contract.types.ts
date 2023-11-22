import {
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi'
import { Abi, Address } from 'viem'
import { SupportedChainId } from '@/lib/config/config.types'

export type TransactionSimulation =
  | ReturnType<typeof usePrepareContractWrite>
  | ReturnType<typeof usePrepareSendTransaction>

export type TransactionExecution =
  | ReturnType<typeof useContractWrite>
  | ReturnType<typeof useSendTransaction>
export type TransactionResult =
  | ReturnType<typeof useWaitForTransaction>
  | ReturnType<typeof useWaitForTransaction>
export type TransactionBundle = {
  simulation: TransactionSimulation
  execution: TransactionExecution
  result: TransactionResult
}

export type AbiItem = Abi[number]
export type WriteAbiMutability = 'payable' | 'nonpayable'
export type ReadAbiMutability = 'view'

export type SdkTransactionConfig = {
  account: Address
  chainId: SupportedChainId
  data: Address
  to: Address
  value?: bigint
}

export type UsePrepareSendTransactionConfig = Exclude<
  Parameters<typeof usePrepareSendTransaction>[0],
  undefined
>

export type Erc20Abi = typeof erc20ABI
