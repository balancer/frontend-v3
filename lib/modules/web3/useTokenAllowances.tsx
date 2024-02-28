import { zipObject } from 'lodash'
import { ContractFunctionConfig } from 'viem'
import { Address, erc20ABI, useContractReads } from 'wagmi'
import { Erc20Abi } from './contracts/contract.types'
import { SupportedChainId } from '@/lib/config/config.types'

export type TokenAllowances = Record<Address, bigint>

export type UseTokenAllowancesResponse = ReturnType<typeof useTokenAllowances>

type Props = {
  chainId: SupportedChainId
  userAddress: Address
  spenderAddress: Address
  tokenAddresses: Address[]
}

export function useTokenAllowances({
  chainId,
  userAddress,
  spenderAddress,
  tokenAddresses,
}: Props) {
  const contracts: ContractFunctionConfig<Erc20Abi, 'allowance'>[] = tokenAddresses.map(
    tokenAddress => ({
      chainId,
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [userAddress, spenderAddress],
    })
  )

  const result = useContractReads({
    contracts,
    allowFailure: false,
    enabled: !!spenderAddress && !!userAddress,
  })

  const allowancesByTokenAddress = result.data ? zipObject(tokenAddresses, result.data) : {}

  function allowanceFor(tokenAddress: Address): bigint {
    // We don't need isSameAddress cause we use the same tokensAddresses source
    return allowancesByTokenAddress[tokenAddress] ?? 0n
  }

  return {
    isAllowancesLoading: result.isLoading,
    isAllowancesRefetching: result.isRefetching,
    allowances: allowancesByTokenAddress,
    spenderAddress,
    refetchAllowances: result.refetch,
    allowanceFor,
  }
}
