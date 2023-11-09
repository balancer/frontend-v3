import { Address } from 'wagmi'
import { useUserTokenAllowance } from './useUserTokenAllowance'
import { vaultV2Address, wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { ReactNode, createContext } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'

export type TokenAllowances = Record<Address, bigint>

/*
  DEBUG: this is a demo hook with harcoded token addreses until we decide how to provide the pool allowances
*/
export function _useTokenAllowances(spenderAddress: Address) {
  const { allowance, refetch: refetchTokenAllowance } = useUserTokenAllowance(
    wETHAddress,
    spenderAddress
  )
  const { allowance: allowance2, refetch: refetchTokenAllowance2 } = useUserTokenAllowance(
    wjAuraAddress,
    spenderAddress
  )

  const allowances = {
    [wETHAddress]: allowance,
    [wjAuraAddress]: allowance2,
  }

  return {
    allowances,
    // QUESTION: do we want individual functions to refetch by token?
    // Probably yes: in order to check it after the token approval has been completed
    // For now we keep it simple
    refetchAllowances: async () => {
      await Promise.all([refetchTokenAllowance(), refetchTokenAllowance2()])
    },
  }
}

export const TokenAllowancesContext = createContext<ReturnType<typeof _useTokenAllowances> | null>(
  null
)

export function TokenAllowancesProvider({ children }: { children: ReactNode }) {
  const hook = _useTokenAllowances(vaultV2Address)
  return <TokenAllowancesContext.Provider value={hook}>{children}</TokenAllowancesContext.Provider>
}

export function useTokenAllowances() {
  return useMandatoryContext(TokenAllowancesContext, 'TokenAllowances')
}
