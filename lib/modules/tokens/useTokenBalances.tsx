'use client'

import { useUserAccount } from '../web3/useUserAccount'
import { Erc20Abi } from '../web3/contracts/contract.types'
import { Address, erc20ABI, useBalance, useContractReads } from 'wagmi'
import { useTokens } from './useTokens'
import { TokenAmount, TokenBase } from './token.types'
import { useNetworkConfig } from '@/lib/config/useNetworkConfig'
import { ContractFunctionConfig, formatUnits } from 'viem'
import { isLoadingQueries, isRefetchingQueries, refetchQueries } from '@/lib/shared/utils/queries'
import { isSameAddress } from '@/lib/shared/utils/addresses'

const BALANCE_CACHE_TIME_MS = 30_000

export function useTokenBalances(tokens: TokenBase[]) {
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

  const contracts: ContractFunctionConfig<Erc20Abi, 'balanceOf'>[] = _tokens.map(token => ({
    address: token.address as Address,
    abi: erc20ABI,
    functionName: 'balanceOf',
    args: [userAddress as Address],
  }))

  const tokenBalancesQuery = useContractReads({
    contracts,
    allowFailure: true,
    enabled: !!userAddress,
    cacheTime: BALANCE_CACHE_TIME_MS,
  })

  async function refetchBalances() {
    return refetchQueries(tokenBalancesQuery, nativeBalanceQuery)
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
