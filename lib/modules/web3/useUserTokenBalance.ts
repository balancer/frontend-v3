import { useIsMounted } from './useIsMounted'
import { Address, useBalance } from 'wagmi'
import { useUserAccount } from './useUserAccount'

export function useUserTokenBalance(tokenAddress: Address) {
  const { mounted } = useIsMounted()
  const { address } = useUserAccount()

  const { isLoading, data: balance } = useBalance({
    address,
    token: tokenAddress,
  })

  if (mounted && address) {
    return { isLoading, formattedBalance: `${balance?.formatted} ${balance?.symbol}` }
  }
  return { isLoading: true, balance: undefined }
}
