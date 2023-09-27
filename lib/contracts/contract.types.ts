import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Abi } from 'viem'

export type TransactionSimulation = ReturnType<typeof usePrepareContractWrite>
export type TransactionExecution = ReturnType<typeof useContractWrite>
export type TransactionInfo = { simulation: TransactionSimulation; execution: TransactionExecution }

export type AbiItem = Abi[number]
