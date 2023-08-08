import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { TokenAmount, TokenBase } from '@/lib/modules/tokens/token.types'
import { useBalance, useQuery } from 'wagmi'
import { Address, formatUnits } from 'viem'
import { AbiERC20 } from '@/lib/abi/AbiERC20'
import { multicall } from 'wagmi/actions'

const BALANCE_CACHE_TIME_MS = 30_000

export function useTokenBalances(account: Address | undefined, tokens: TokenBase[]) {
  const networkConfig = useNetworkConfig()
  const filteredTokens = tokens.filter(
    token => token.address !== networkConfig.tokens.nativeAsset.address
  )
  const containsEth = filteredTokens.length < tokens.length

  const ethBalance = useBalance({
    address: (account || '') as Address,
    enabled: account !== null && containsEth,
    cacheTime: BALANCE_CACHE_TIME_MS,
  })

  const contractReads = useQuery(
    // This query key can potentially collide, but it will overflow the useQuery
    // cache if this list of tokens is large.
    [`useTokenBalances:${account}:${networkConfig.chainId}:${tokens.length}`],
    async () => {
      const data = await multicall({
        contracts: filteredTokens.map(token => ({
          abi: AbiERC20,
          address: token.address as Address,
          functionName: 'balanceOf',
          args: [account || ''],
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
      ethBalanceResponse: await ethBalance.refetch(),
      multicallResponse: await contractReads.refetch(),
    }
  }

  const balances: TokenAmount[] = (contractReads.data || []).map((item, index) => {
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

  if (containsEth) {
    balances.push({
      chainId: networkConfig.chainId,
      address: networkConfig.tokens.nativeAsset.address,
      decimals: 18,
      amount: ethBalance.data?.value || 0n,
      formatted: ethBalance.data?.formatted || '0',
    })
  }

  return {
    data: balances,
    isLoading: ethBalance.isLoading || contractReads.isLoading,
    isError: ethBalance.isError || contractReads.isError,
    error: ethBalance.error || contractReads.error,
    isRefetching: ethBalance.isRefetching || contractReads.isRefetching,
    refetch,
  }
}
