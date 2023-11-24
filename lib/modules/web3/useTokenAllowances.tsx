import { zipObject } from 'lodash'
import { ContractFunctionConfig } from 'viem'
import { Address, erc20ABI, useContractReads } from 'wagmi'
import { Erc20Abi } from './contracts/contract.types'
import { PropsWithChildren, createContext } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'

export type TokenAllowances = Record<Address, bigint>

export function _useTokenAllowances(
  userAccount: Address,
  spenderAddress: Address,
  tokenAddresses: Address[]
) {
  const contracts: ContractFunctionConfig<Erc20Abi, 'allowance'>[] = tokenAddresses.map(
    tokenAddress => ({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [userAccount, spenderAddress],
    })
  )

  const result = useContractReads({
    contracts,
    allowFailure: false,
    enabled: !!spenderAddress && !!userAccount,
  })

  const allowancesByTokenAddress = result.data ? zipObject(tokenAddresses, result.data) : {}

  return {
    isAllowancesLoading: result.isLoading,
    isAllowancesRefetching: result.isRefetching,
    allowances: allowancesByTokenAddress,
    refetchAllowances: result.refetch,
  }
}

type UseTokenAllowancesResponse = ReturnType<typeof _useTokenAllowances>
export const TokenAllowancesContext = createContext<UseTokenAllowancesResponse | null>(null)

export function TokenAllowancesProvider({
  children,
  tokenAddresses,
  userAddress,
  spenderAddress,
}: PropsWithChildren<{
  tokenAddresses: Address[]
  userAddress: Address
  spenderAddress: Address
}>) {
  const hook = _useTokenAllowances(userAddress, spenderAddress, tokenAddresses)

  return <TokenAllowancesContext.Provider value={hook}>{children}</TokenAllowancesContext.Provider>
}

export function useTokenAllowances() {
  return useMandatoryContext(TokenAllowancesContext, 'TokenAllowances')
}
