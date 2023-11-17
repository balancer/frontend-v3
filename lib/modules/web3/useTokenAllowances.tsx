import { zipObject } from 'lodash'
import { ContractFunctionConfig } from 'viem'
import { Address, erc20ABI, useContractReads } from 'wagmi'
import { Erc20Abi } from './contracts/contract.types'

export type TokenAllowances = Record<Address, bigint>

export function useTokenAllowances(
  userAccount: Address,
  spenderAddress: Address,
  tokenAddresses: Address[]
) {
  const contracts: ContractFunctionConfig<Erc20Abi, 'allowance'>[] = tokenAddresses.map(
    tokenAddress => ({
      address: tokenAddress,
      abi: erc20ABI,
      functionName: 'allowance',
      args: [spenderAddress, userAccount],
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
