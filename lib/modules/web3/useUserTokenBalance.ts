import { useIsMounted } from './useIsMounted'
import { Address, useBalance } from 'wagmi'
import { useUserAccount } from './useUserAccount'
import { prettyPrintBalance } from '@/lib/utils/balances'

export function useUserTokenBalance(tokenAddress: Address) {
  const { mounted } = useIsMounted()
  const { address } = useUserAccount()

  const { isLoading, data: balance } = useBalance({
    address,
    token: tokenAddress,
  })

  if (mounted && address) {
    return { isLoading, balance, formattedBalance: prettyPrintBalance(balance) }
  }
  return { isLoading: true, balance, formattedBalance: '-' }
}
