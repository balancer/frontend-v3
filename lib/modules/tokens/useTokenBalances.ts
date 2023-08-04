import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import {
  TokenAmountHumanReadable,
  TokenBase,
} from '@/lib/modules/tokens/token-types'
import { useBalance } from 'wagmi'
import { Address, formatUnits } from 'viem'
import ERC20Abi from '@/lib/abi/ERC20.json'
import { useMulticall2 } from '@/lib/utils/useMulticall2'

const BALANCE_CACHE_TIME_MS = 30_000

export function useTokenBalances(
  account: Address | undefined,
  tokens: TokenBase[]
) {
  const networkConfig = useNetworkConfig()
  const containsEth = !!tokens.find(
    token => token.address === networkConfig.tokens.nativeAsset.address
  )
  const filteredTokens = tokens.filter(
    token => token.address !== networkConfig.tokens.nativeAsset.address
  )

  const ethBalance = useBalance({
    address: (account || '') as Address,
    enabled: account !== null && containsEth,
    cacheTime: BALANCE_CACHE_TIME_MS,
  })

  const contractReads = useMulticall2<bigint>({
    abi: ERC20Abi,
    calls: filteredTokens.map(token => ({
      address: token.address as Address,

      functionName: 'balanceOf',
      args: [account || ''],
    })),
    enabled: !!account && filteredTokens.length > 0,
    cacheTime: BALANCE_CACHE_TIME_MS,
    // This query key can collide, but we cannot very large keys as they
    // overflow the useQuery cache
    queryKey: `balances:${account}:${networkConfig.chainId}:${tokens.length}`,
  })

  async function refetch() {
    return {
      ethBalanceResponse: await ethBalance.refetch(),
      multicallResponse: await contractReads.refetch(),
    }
  }

  const balances: TokenAmountHumanReadable[] = contractReads.data
    ? filteredTokens.map((token, index) => {
        return {
          address: token.address,
          amount:
            contractReads.data && contractReads.data[index]
              ? formatUnits(contractReads.data[index] || 0n, token.decimals)
              : '0',
          chainId: networkConfig.chainId,
        }
      })
    : []

  if (containsEth) {
    balances.push({
      address: networkConfig.tokens.nativeAsset.address.toLowerCase(),
      amount: ethBalance.data?.formatted || '0',
      chainId: networkConfig.chainId,
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
