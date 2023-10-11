import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Abi, Address } from 'viem'
import { useManagedTransaction } from './useManagedTransaction'

export type TransactionSimulation = ReturnType<typeof usePrepareContractWrite>
export type TransactionExecution = ReturnType<typeof useContractWrite>
export type TransactionResult = { hash: Address }
export type TransactionInfo = { simulation: TransactionSimulation; execution: TransactionExecution }

export type AbiItem = Abi[number]
export type WriteAbiMutability = 'payable' | 'nonpayable'
export type TransactionStep = {
  id: string
  getButtonLabel: (props?: any) => string
  execution: ReturnType<typeof useManagedTransaction>['execution']
  simulation: ReturnType<typeof useManagedTransaction>['simulation']
  result: ReturnType<typeof useManagedTransaction>['result']
}
