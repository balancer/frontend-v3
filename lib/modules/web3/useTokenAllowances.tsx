import { zipObject } from 'lodash'
import { Address, ReadContractParameters, erc20Abi } from 'viem'
import { useReadContracts } from 'wagmi'
import { Erc20Abi } from './contracts/contract.types'
import { SupportedChainId } from '@/lib/config/config.types'
import { useCallback, useMemo } from 'react'

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
  const contracts: ReadContractParameters<Erc20Abi, 'allowance'>[] = tokenAddresses.map(
    tokenAddress => ({
      chainId,
      address: tokenAddress,
      abi: erc20Abi,
      functionName: 'allowance',
      args: [userAddress, spenderAddress],
    })
  )

  const result = useReadContracts({
    contracts,
    allowFailure: false,
    query: { enabled: !!spenderAddress && !!userAddress },
  })

  const allowancesByTokenAddress = useMemo(
    () => (result.data ? zipObject(tokenAddresses, result.data) : {}),
    [result.data, tokenAddresses]
  )

  const allowanceFor = useCallback(
    (tokenAddress: Address): bigint => {
      // We don't need isSameAddress cause we use the same tokensAddresses source
      return allowancesByTokenAddress[tokenAddress] ?? 0n
    },
    [allowancesByTokenAddress]
  )

  return {
    isAllowancesLoading: result.isLoading,
    isAllowancesRefetching: result.isRefetching,
    allowances: allowancesByTokenAddress,
    spenderAddress,
    refetchAllowances: result.refetch,
    allowanceFor,
  }
}
