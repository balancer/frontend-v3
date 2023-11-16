import { Address, erc20ABI, useContractReads } from 'wagmi'
import { WagmiReadContract } from './contracts/contract.types'

export type TokenAllowances = Record<Address, bigint>

export function useTokenAllowances(
  userAccount: Address,
  spenderAddress: Address,
  tokenAddresses: Address[]
) {
  const contracts: WagmiReadContract<'allowance'>[] = tokenAddresses.map(tokenAddress => ({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: 'allowance',
    args: [spenderAddress, userAccount],
  }))

  const result = useContractReads({
    contracts,
    allowFailure: false,
    enabled: !!spenderAddress && !!userAccount,
  })

  return {
    isAllowancesLoading: result.isLoading,
    isAllowancesRefetching: result.isRefetching,
    allowances: result.data,
    refetchAllowances: result.refetch,
  }
}
