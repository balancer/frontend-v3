import { TokenBase } from '@/lib/modules/tokens/token.types'
import { useTokenBalances } from './useTokenBalances'
import { Address } from 'viem'

/**
 *
 * Example hook to illustrate the problems testing a superhook that depends on a hook using onchain calls
 *
 * This kind of superhook would not make sense in real life but it is deliberately for didactic purposes
 *
 */
export function useEmptyTokenBalances(account: Address, tokens: TokenBase[]) {
  const { balances, isLoading } = useTokenBalances(account, tokens)

  const emptyBalances = balances.filter(balance => balance.amount === 0n)
  return { loading: isLoading, emptyBalances }
}
