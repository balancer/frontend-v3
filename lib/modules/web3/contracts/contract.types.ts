import {
  erc20ABI,
  useContractWrite,
  usePrepareContractWrite,
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from 'wagmi'
import { Abi, Address, ContractFunctionConfig, GetFunctionArgs } from 'viem'
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
  chainId: ChainId
  data: Address
  to: Address
  value?: bigint
}

export type UsePrepareSendTransactionConfig = Exclude<
  Parameters<typeof usePrepareSendTransaction>[0],
  undefined
>

export type Erc20Abi = typeof erc20ABI

// TODO: see if we can improve the TS DX further with this type
// export type WagmiContractConfig = {
//   address: Address
//   abi: Erc20Abi
//   functionName: InferFunctionName<Erc20Abi, string, ReadAbiMutability>
//   args: GetFunctionArgs<Erc20Abi, string>['args']
// }

export type WagmiReadContract<T extends string> = ContractFunctionConfig<
  Erc20Abi,
  T,
  ReadAbiMutability
> &
  GetFunctionArgs<Erc20Abi, T>
