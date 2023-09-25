import { EncodeFunctionDataParameters } from 'viem'
import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { TransactionInfo, TransactionSimulation } from './contracts.types'

export function useWriteContractWithSimulation(
  contractConfig: EncodeFunctionDataParameters,
  enabled: boolean
): TransactionInfo {
  const simulation = usePrepareContractWrite({
    ...contractConfig,
    enabled,
  }) as TransactionSimulation // Avoid problems with narrow types

  const execution = useContractWrite(simulation.config)

  return { simulation, execution }
}
