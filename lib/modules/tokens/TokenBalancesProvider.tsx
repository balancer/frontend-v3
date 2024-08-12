'use client'

import { useUserAccount } from '../web3/UserAccountProvider'
import { useBalance, useReadContracts } from 'wagmi'
import { erc20Abi } from 'viem'
import { TokenAmount, TokenBase } from './token.types'
import { Address, formatUnits } from 'viem'
import { isLoadingQueries, isRefetchingQueries, refetchQueries } from '@/lib/shared/utils/queries'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { PropsWithChildren, createContext, useState } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { getNetworkConfig } from '@/lib/config/app.config'
import { GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { exclNativeAssetFilter, nativeAssetFilter } from './token.helpers'
import { HumanAmount, Slippage } from '@balancer/sdk'
import { useUserSettings } from '../user/settings/UserSettingsProvider'

const BALANCE_CACHE_TIME_MS = 30_000

export type UseTokenBalancesResponse = ReturnType<typeof _useTokenBalances>
export const TokenBalancesContext = createContext<UseTokenBalancesResponse | null>(null)

/**
 * If initTokens are provided the tokens state will be managed internally.
 * If extTokens are provided the tokens state will be managed externally.
 */
export function _useTokenBalances(
  initTokens?: GqlToken[],
  extTokens?: GqlToken[],
  subtractSlippage?: boolean
) {
  if (!initTokens && !extTokens) throw new Error('initTokens or tokens must be provided')
  if (initTokens && extTokens) throw new Error('initTokens and tokens cannot be provided together')

  const [_tokens, _setTokens] = useState<GqlToken[]>(initTokens || [])

  const { userAddress } = useUserAccount()
  const { slippage } = useUserSettings()

  const tokens = extTokens || _tokens

  const NO_TOKENS_CHAIN_ID = 1 // this should never be used as the multicall is disabled when no tokens
  const chainId = tokens.length ? tokens[0].chainId : NO_TOKENS_CHAIN_ID
  const networkConfig = getNetworkConfig(chainId)
  const includesNativeAsset = tokens.some(nativeAssetFilter(chainId))
  const tokensExclNativeAsset = tokens.filter(exclNativeAssetFilter(chainId))

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
        enabled: !!userAddress && tokensExclNativeAsset.length > 0,
        gcTime: BALANCE_CACHE_TIME_MS,
      },
      contracts: tokensExclNativeAsset.map(token => ({
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
      const token = tokensExclNativeAsset[index]
      if (!token) return

      let amount = balance.status === 'success' ? (balance.result as bigint) : 0n

      if (subtractSlippage) {
        // Subtract slippage from balance
        amount = Slippage.fromPercentage(slippage as HumanAmount).applyTo(amount, -1)
      }

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
    const nativeBalance = subtractSlippage
      ? Slippage.fromPercentage(slippage as HumanAmount).applyTo(nativeBalanceQuery.data.value, -1)
      : nativeBalanceQuery.data.value

    balances.push({
      chainId,
      address: networkConfig.tokens.nativeAsset.address,
      amount: nativeBalance,
      formatted: formatUnits(nativeBalance, networkConfig.tokens.nativeAsset.decimals),
      decimals: networkConfig.tokens.nativeAsset.decimals,
    })
  }

  function balanceFor(token: TokenBase | string): TokenAmount | undefined {
    const address = typeof token === 'string' ? token : token.address

    return balances.find(balance => isSameAddress(balance.address, address))
  }

  function setTokens(tokens: GqlToken[]) {
    if (extTokens) throw new Error('Cannot set tokens when using external tokens')
    _setTokens(tokens)
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
  initTokens?: GqlToken[]
  extTokens?: GqlToken[]
  // This can be useful in cases where you want to leave a buffer,
  // for example in forced proportional add liquidities where
  // slippage means the tx will take more than your input.
  subtractSlippage?: boolean
}>

export function TokenBalancesProvider({
  initTokens,
  extTokens,
  subtractSlippage,
  children,
}: ProviderProps) {
  const hook = _useTokenBalances(initTokens, extTokens, subtractSlippage)
  return <TokenBalancesContext.Provider value={hook}>{children}</TokenBalancesContext.Provider>
}

export const useTokenBalances = (): UseTokenBalancesResponse =>
  useMandatoryContext(TokenBalancesContext, 'TokenBalances')
