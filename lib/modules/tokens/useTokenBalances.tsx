import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { TokenAmount, TokenBase } from '@/lib/modules/tokens/token.types'
import { useAccount, useBalance, useQuery } from 'wagmi'
import { Address, formatUnits } from 'viem'
import { AbiERC20 } from '@/lib/abi/AbiERC20'
import { multicall } from 'wagmi/actions'
import { isSameAddress } from '@/lib/utils/addresses'
import { PropsWithChildren, createContext, useContext } from 'react'
import { useTokens } from './useTokens'

const BALANCE_CACHE_TIME_MS = 30_000

export function _useTokenBalances(account: Address | undefined, tokens: TokenBase[]) {
  const networkConfig = useNetworkConfig()
  const filteredTokens = tokens.filter(
    token => !isSameAddress(token.address, networkConfig.tokens.nativeAsset.address)
  )
  const containsNativeAsset = filteredTokens.length < tokens.length

  const nativeBalanceQuery = useBalance({
    address: (account || '') as Address,
    enabled: account !== null && containsNativeAsset,
    cacheTime: BALANCE_CACHE_TIME_MS,
  })

  const balanceMulticall = useQuery(
    // This query key can potentially collide, but it will overflow the useQuery
    // cache if this list of tokens is large.
    [`useTokenBalances:${account}:${networkConfig.chainId}:${tokens.length}`],
    async () => {
      const data = await multicall({
        contracts: filteredTokens.map(token => ({
          abi: AbiERC20,
          address: token.address as Address,
          functionName: 'balanceOf',
          args: [(account || '') as Address],
        })),
      })

      return data
    },
    {
      enabled: !!account && filteredTokens.length > 0,
      cacheTime: BALANCE_CACHE_TIME_MS,
    }
  )

  async function refetch() {
    return {
      nativeBalanceResponse: await nativeBalanceQuery.refetch(),
      multicallResponse: await balanceMulticall.refetch(),
    }
  }

  const balances: TokenAmount[] = (balanceMulticall.data || []).map((item, index) => {
    const token = filteredTokens[index]
    const amount = item.status === 'success' ? (item.result as bigint) : 0n

    return {
      chainId: networkConfig.chainId,
      address: token.address,
      amount: amount,
      formatted: formatUnits(amount, token.decimals),
      decimals: token.decimals,
    }
  })

  if (containsNativeAsset) {
    balances.push({
      chainId: networkConfig.chainId,
      address: networkConfig.tokens.nativeAsset.address,
      decimals: 18,
      amount: nativeBalanceQuery.data?.value || 0n,
      formatted: nativeBalanceQuery.data?.formatted || '0',
    })
  }

  return {
    balances,
    isLoading: nativeBalanceQuery.isLoading || balanceMulticall.isLoading,
    isError: nativeBalanceQuery.isError || balanceMulticall.isError,
    error: nativeBalanceQuery.error || balanceMulticall.error,
    isRefetching: nativeBalanceQuery.isRefetching || balanceMulticall.isRefetching,
    refetch,
  }
}

export type UseTokenBalancesResponse = ReturnType<typeof _useTokenBalances>
export const TokenBalancesContext = createContext<UseTokenBalancesResponse | null>(null)

export function TokenBalancesProvider({ children }: PropsWithChildren) {
  const { address } = useAccount()
  const { tokens } = useTokens()
  const result = _useTokenBalances(address, tokens)
  return <TokenBalancesContext.Provider value={result}>{children}</TokenBalancesContext.Provider>
}

export function useTokenBalances() {
  const context = useContext(TokenBalancesContext)
  if (!context) {
    throw new Error('useTokenBalances must be used within a TokenBalancesProvider context')
  }
  return context
}
