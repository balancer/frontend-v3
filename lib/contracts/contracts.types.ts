import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { Abi } from 'viem'

// QUESTION: these are wagmi hooks related types: rename to match implementation detail?
// TxWagmiSimulation, TxWagmiExecution, TxWagmiInfo
// There will be other wagmi types like the one that useTransaction({hash}) returns
export type TransactionSimulation = ReturnType<typeof usePrepareContractWrite>
export type TransactionExecution = ReturnType<typeof useContractWrite>
export type TransactionInfo = { simulation: TransactionSimulation; execution: TransactionExecution }

export type AbiItem = Abi[number]
