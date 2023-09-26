import { get } from 'lodash'
import { Abi, Address, EncodeFunctionDataParameters } from 'viem'
import { vaultV2ABI } from '../abi/generated'
import { useNetworkConfig } from '../config/useNetworkConfig'

// Returns a contract config with dynamic contract address depending on the network
export function useWriteContractConfig<
  const TAbi extends Abi | readonly unknown[],
  TFunctionName extends string | undefined = undefined
>({ abi, functionName, args }: EncodeFunctionDataParameters<TAbi, TFunctionName>) {
  // If user is not connected we return or throw
  const vaultContractAddress = useContractAddress(abi as Abi)

  const data = {
    address: vaultContractAddress,
    abi,
    args,
    functionName,
  } as unknown as EncodeFunctionDataParameters<TAbi, TFunctionName> & { address: Address }
  return buildContractConfig(data)
}

function buildContractConfig<
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

function useContractAddress(abi: Abi): Address {
  const networkConfig = useNetworkConfig()

  const v2VaultId = 'balancer.vault'

  // Every Abi will have its matching address
  // Could this have bad performance?
  let contractId: string
  if (abi === vaultV2ABI) contractId = v2VaultId
  else throw new Error('Contract id not found for abi: ' + abi)

  const address = get(networkConfig.contracts, contractId)
  return address
}
