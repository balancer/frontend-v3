import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { PropsWithChildren, createContext } from 'react'
import { Address, erc20ABI, useContractReads } from 'wagmi'
import { WagmiReadContract } from './contracts/contract.types'
import { useContractAddress } from './contracts/useContractAddress'
import { emptyAddress } from './contracts/wagmi-helpers'
import { useUserAccount } from './useUserAccount'

export type TokenAllowances = Record<Address, bigint>

export function _useTokenAllowances(
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

type UseTokenAllowancesResponse = ReturnType<typeof _useTokenAllowances>
export const TokenAllowancesContext = createContext<UseTokenAllowancesResponse | null>(null)

export function TokenAllowancesProvider({
  children,
  tokenAddresses,
}: PropsWithChildren<{
  tokenAddresses: Address[]
}>) {
  const { userAddress } = useUserAccount()
  const spenderAddress = useContractAddress('balancer.vaultV2')
  const hook = _useTokenAllowances(
    userAddress || emptyAddress,
    spenderAddress || emptyAddress,
    tokenAddresses
  )

  return <TokenAllowancesContext.Provider value={hook}>{children}</TokenAllowancesContext.Provider>
}

export function useTokenAllowances() {
  return useMandatoryContext(TokenAllowancesContext, 'TokenAllowances')
}
