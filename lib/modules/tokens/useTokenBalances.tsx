'use client'

import { useUserAccount } from '../web3/useUserAccount'
import { useBalance, useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'
import { useTokens } from './useTokens'
import { TokenAmount, TokenBase } from './token.types'
import { Address, formatUnits } from 'viem'
import { isLoadingQueries, isRefetchingQueries, refetchQueries } from '@/lib/shared/utils/queries'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { PropsWithChildren, createContext, useState } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { getNetworkConfig } from '@/lib/config/app.config'

const BALANCE_CACHE_TIME_MS = 30_000

export type UseTokenBalancesResponse = ReturnType<typeof _useTokenBalances>
export const TokenBalancesContext = createContext<UseTokenBalancesResponse | null>(null)

export function _useTokenBalances(initTokens: TokenBase[]) {
  const [tokens, setTokens] = useState<TokenBase[]>(initTokens)
  const { userAddress } = useUserAccount()
  const { exclNativeAssetFilter, nativeAssetFilter } = useTokens()

  const NO_TOKENS_CHAIN_ID = 1 // this should never be used as the multicall is disabled when no tokens
  const chainId = tokens.length ? tokens[0].chainId : NO_TOKENS_CHAIN_ID
  const networkConfig = getNetworkConfig(chainId)

  const includesNativeAsset = tokens.some(nativeAssetFilter)
  const _tokens = tokens.filter(exclNativeAssetFilter)

  const nativeBalanceQuery = useBalance({
    chainId,
    address: userAddress,
    query: {
      enabled: !!userAddress && includesNativeAsset,
      gcTime: BALANCE_CACHE_TIME_MS,
    },
  })

  const tokenBalancesQuery = useReadContracts(
    // This query key can potentially collide, but it will overflow the useQuery
    // cache if this list of tokens is large.
    {
      query: {
        enabled: !!userAddress && _tokens.length > 0,
        gcTime: BALANCE_CACHE_TIME_MS,
      },
      contracts: _tokens.map(token => ({
        chainId,
        abi: erc20Abi,
        address: token.address as Address,
        functionName: 'balanceOf',
        args: [(userAddress || '') as Address],
      })),
    }
  )

  async function refetchBalances() {
    if (includesNativeAsset) return refetchQueries(tokenBalancesQuery, nativeBalanceQuery)

    return refetchQueries(tokenBalancesQuery)
  }

  const balances = (tokenBalancesQuery.data || [])
    .map((balance, index) => {
      const token = _tokens[index]
      if (!token) return
      const amount = balance.status === 'success' ? (balance.result as bigint) : 0n

      return {
        chainId,
        address: token.address,
        amount,
        formatted: formatUnits(amount, token.decimals),
        decimals: token.decimals,
      }
    })
    .filter(Boolean) as TokenAmount[]

  if (includesNativeAsset && nativeBalanceQuery.data) {
    balances.push({
      chainId,
      address: networkConfig.tokens.nativeAsset.address,
      amount: nativeBalanceQuery.data.value,
      formatted: formatUnits(
        nativeBalanceQuery.data.value,
        networkConfig.tokens.nativeAsset.decimals
      ),
      decimals: networkConfig.tokens.nativeAsset.decimals,
    })
  }

  function balanceFor(token: TokenBase | string): TokenAmount | undefined {
    const address = typeof token === 'string' ? token : token.address

    return balances.find(balance => isSameAddress(balance.address, address))
  }

  return {
    tokens,
    balances,
    isBalancesLoading: isLoadingQueries(tokenBalancesQuery, nativeBalanceQuery),
    isBalancesRefetching: isRefetchingQueries(tokenBalancesQuery, nativeBalanceQuery),
    setTokens,
    refetchBalances,
    balanceFor,
  }
}

type ProviderProps = PropsWithChildren<{
  tokens: TokenBase[]
}>

export function TokenBalancesProvider({ tokens, children }: ProviderProps) {
  const hook = _useTokenBalances(tokens)
  return <TokenBalancesContext.Provider value={hook}>{children}</TokenBalancesContext.Provider>
}

export const useTokenBalances = (): UseTokenBalancesResponse =>
  useMandatoryContext(TokenBalancesContext, 'TokenBalances')
