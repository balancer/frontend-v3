import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { Dictionary, isEmpty, zipObject } from 'lodash'
import { PropsWithChildren, createContext } from 'react'
import { ContractFunctionConfig, parseUnits } from 'viem'
import { Address, erc20ABI, useContractReads } from 'wagmi'
import { HumanAmountIn } from '../pool/actions/liquidity-types'
import { Pool } from '../pool/usePool'
import { useTokens } from '../tokens/useTokens'
import { Erc20Abi } from './contracts/contract.types'

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

  const { getToken } = useTokens()

  const allowancesByTokenAddress = result.data ? zipObject(tokenAddresses, result.data) : {}

  // Checks that the user has enough allowance for all the token amounts in the current add liquidity operation
  function hasAllowances(humanAmountsIn: HumanAmountIn[], pool: Pool) {
    if (isEmpty(allowancesByTokenAddress)) return false

    return humanAmountsIn.every(humanAmountIn =>
      _hasAllowance(
        humanAmountIn,
        allowancesByTokenAddress,
        getToken(humanAmountIn.tokenAddress, pool.chain)
      )
    )
  }

  return {
    isAllowancesLoading: result.isLoading,
    isAllowancesRefetching: result.isRefetching,
    allowances: allowancesByTokenAddress,
    spenderAddress,
    hasAllowances,
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

export function _hasAllowance(
  humanAmountIn: HumanAmountIn,
  allowancesByTokenAddress: Dictionary<bigint>,
  token?: GqlToken
) {
  if (!token) {
    throw new Error(`Token address ${humanAmountIn.tokenAddress} not found when checking approvals`)
  }
  const humanAmount = humanAmountIn.humanAmount
  if (humanAmount === '') return true
  if (humanAmount === '0') return true

  const rawAmount = parseUnits(humanAmount, token.decimals)

  return allowancesByTokenAddress[humanAmountIn.tokenAddress] >= rawAmount
}
