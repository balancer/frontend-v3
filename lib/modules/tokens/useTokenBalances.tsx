'use client'

import { useUserAccount } from '../web3/useUserAccount'
import { Address, erc20ABI, useBalance, useQuery } from 'wagmi'
import { useTokens } from './useTokens'
import { TokenAmount, TokenBase } from './token.types'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { formatUnits } from 'viem'
import { isLoadingQueries, isRefetchingQueries, refetchQueries } from '@/lib/shared/utils/queries'
import { multicall } from 'wagmi/actions'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { PropsWithChildren, createContext } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import crypto from 'crypto'
import { orderBy } from 'lodash'

const BALANCE_CACHE_TIME_MS = 30_000

export type UseTokenBalancesResponse = ReturnType<typeof _useTokenBalances>
export const TokenBalancesContext = createContext<UseTokenBalancesResponse | null>(null)

export function _useTokenBalances(tokens: TokenBase[]) {
  const { userAddress } = useUserAccount()
  const { exclNativeAssetFilter, nativeAssetFilter } = useTokens()
  const networkConfig = useNetworkConfig()

  const includesNativeAsset = tokens.some(nativeAssetFilter)
  const _tokens = tokens.filter(exclNativeAssetFilter)

  const nativeBalanceQuery = useBalance({
    address: userAddress,
    enabled: !!userAddress && includesNativeAsset,
    cacheTime: BALANCE_CACHE_TIME_MS,
  })

  // TODO: Revert to useReadContracts when it's supported in wagmi, and remove multicall.
  // Onces it's supported in wagmi we can then manually set the queryKey to
  // avoid the overflow issue.
  // const contracts: ContractFunctionConfig<Erc20Abi, 'balanceOf'>[] = _tokens.map(token => ({
  //   address: token.address as Address,
  //   abi: erc20ABI,
  //   functionName: 'balanceOf',
  //   args: [userAddress as Address],
  // }))

  // const tokenBalancesQuery = useReadContracts({
  //   contracts,
  //   allowFailure: true,
  //   enabled: !!userAddress,
  //   cacheTime: BALANCE_CACHE_TIME_MS,
  // })

  // Generates a consistent hash key for the query based on the tokens provided.
  function hashKey() {
    const hash = crypto.createHash('sha256')
    const orderedTokens = orderBy(tokens, 'address')
      .map(t => t.address)
      .join('')
    hash.update(orderedTokens)
    return hash.digest('hex')
  }

  const tokenBalancesQuery = useQuery(
    // This query key can potentially collide, but it will overflow the useQuery
    // cache if this list of tokens is large.
    [`useTokenBalances:${userAddress}:${networkConfig.chainId}:${hashKey()}`],
    async () => {
      const data = await multicall({
        contracts: _tokens.map(token => ({
          abi: erc20ABI,
          address: token.address as Address,
          functionName: 'balanceOf',
          args: [(userAddress || '') as Address],
        })),
      })

      return data
    },
    {
      enabled: !!userAddress && _tokens.length > 0,
      cacheTime: BALANCE_CACHE_TIME_MS,
    }
  )

  async function refetchBalances() {
    if (includesNativeAsset) return refetchQueries(tokenBalancesQuery, nativeBalanceQuery)

    return refetchQueries(tokenBalancesQuery)
  }

  const balances: TokenAmount[] = (tokenBalancesQuery.data || []).map((balance, index) => {
    const token = _tokens[index]
    const amount = balance.status === 'success' ? (balance.result as bigint) : 0n

    return {
      chainId: networkConfig.chainId,
      address: token.address,
      amount,
      formatted: formatUnits(amount, token.decimals),
      decimals: token.decimals,
    }
  })

  if (includesNativeAsset && nativeBalanceQuery.data) {
    balances.push({
      chainId: networkConfig.chainId,
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
    balances,
    isBalancesLoading: isLoadingQueries(tokenBalancesQuery, nativeBalanceQuery),
    isBalancesRefetching: isRefetchingQueries(tokenBalancesQuery, nativeBalanceQuery),
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
