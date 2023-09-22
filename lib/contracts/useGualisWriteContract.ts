import { useContractWrite, usePrepareContractWrite } from 'wagmi'
import { usePrepareVaultWrite, useVaultWrite, vaultABI } from '../abi/generated'
import { useVaultContractAddress } from './Vault'
import { Abi, Address, EncodeFunctionDataParameters } from 'viem'
import { useNetworkConfig } from '../config/useNetworkConfig'
import { get } from 'lodash'
import { useEffect } from 'react'
import { useTransactions } from '../modules/web3/TransactionsProvider'

// const externalArguments =

const balancerRelayer = '0xfeA793Aa415061C483D2390414275AD314B3F621'

export function useGualisWriteContract() {
  const vaultContractAddress = useVaultContractAddress()

  const prepareWriteResult = usePrepareVaultWrite({
    address: vaultContractAddress,
    functionName: 'setRelayerApproval',
    args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', balancerRelayer, true],
  })
  // sending
  const writeResult = useVaultWrite(prepareWriteResult.config)

  return { prepareWriteResult, writeResult }
}

// const config: UsePrepareContractWriteConfig<typeof vaultABI, TFunctionName extends string>) = {
//   address: vaultContractAddress,
//   functionName: 'setRelayerApproval',
//   args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', balancerRelayer, true]
// }

export type AbiItem = Abi[number]

export function buildContractFunctionDataWithoutAddress<
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends string | undefined = undefined
>({ abi, args, functionName }: EncodeFunctionDataParameters<TAbi, TFunctionName>) {
  return { abi, args, functionName }
}

export function buildContractConfig<
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends string | undefined = undefined
>({
  address,
  abi,
  args,
  functionName,
}: EncodeFunctionDataParameters<TAbi, TFunctionName> & { address: Address }) {
  return { address, abi, args, functionName } as const
}

// export function buildFoo<
//   const TAbi extends Abi | readonly unknown[],
//   TFunctionName extends string | undefined = undefined
// >({ abi, functionName, args }: EncodeFunctionDataParameters<TAbi, TFunctionName>) {
//   return { abi, args, functionName }
// }

// buildContractFunctionData({
//   address: vaultContractAddress,
//   abi: vaultABI,
//   functionName: 'setRelayerApproval',
//   args: ['0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266', balancerRelayer, true],
// })

// export function useVaultContractAddress() {

// Returns a contract config with dynamic contract address depending on the network
export function useContractConfig<
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends string | undefined = undefined
>({ abi, functionName, args }: EncodeFunctionDataParameters<TAbi, TFunctionName>) {
  // If user is not connected we return or throw
  const vaultContractAddress = useContractAddress(abi as Abi)

  vaultABI
  const data = {
    address: vaultContractAddress,
    abi,
    args,
    functionName,
  } as unknown as EncodeFunctionDataParameters<TAbi, TFunctionName> & { address: Address }
  return buildContractConfig(data)
}

export function useContractAddress(abi: Abi): Address {
  const networkConfig = useNetworkConfig()

  const v2VaultId = 'balancer.vault'

  // Every Abi will have its matching address
  // Could this have bad performance?
  let contractId: string
  if (abi === vaultABI) contractId = v2VaultId
  else throw new Error('Contract id not found for abi: ' + abi)

  const address = get(networkConfig.contracts, contractId)
  return address
}

export function useWriteContractWithSimulation(
  contractConfig: EncodeFunctionDataParameters,
  enabled: boolean
) {
  const simulation = usePrepareContractWrite({
    ...contractConfig,
    enabled,
  })

  const execution = useContractWrite(simulation.config)

  return { simulation, execution }
}

type TransactionSimulation = ReturnType<typeof usePrepareContractWrite>
type TransactionExecution = ReturnType<typeof useContractWrite>
type TransactionInfo = { simulation: TransactionSimulation; execution: TransactionExecution }

export function useOnNewTxHash({ simulation, execution }: TransactionInfo) {
  const { transactions, setTransactions } = useTransactions()
  useEffect(() => {
    if (execution.data?.hash) {
      console.log('NEW TRANSACTION HASH!', execution.data.hash)
      setTransactions([{ simulation, execution }])
      // addTransaction(setAuthorizerExampleOneHash?.hash)
    }
  }, [execution.data?.hash])
}
