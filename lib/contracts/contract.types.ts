import { useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'
import { Abi } from 'viem'
import { useManagedTransaction } from './useManagedTransaction'

export type TransactionSimulation = ReturnType<typeof usePrepareContractWrite>
export type TransactionExecution = ReturnType<typeof useContractWrite>
export type TransactionResult = ReturnType<typeof useWaitForTransaction>
export type TransactionInfo = {
  simulation: TransactionSimulation
  execution: TransactionExecution
  result: TransactionResult
}

export type AbiItem = Abi[number]
export type WriteAbiMutability = 'payable' | 'nonpayable'

