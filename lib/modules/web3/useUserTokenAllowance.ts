import { Address } from 'wagmi'
import { useUserAccount } from './useUserAccount'
import { useIsMounted } from './useIsMounted'
import { useErc20Read } from './contracts/useErc20Read'

export function useUserTokenAllowance(tokenAddress: Address, spenderAddress: Address) {
  const { mounted } = useIsMounted()
  const { userAddress, isConnected } = useUserAccount()

  const query = useErc20Read(
    tokenAddress,
    'allowance',
    { args: [userAddress, spenderAddress] },
    { enabled: isConnected }
  )

  // TODO: fix type inference
  if (mounted && query.data) {
    return { ...query, allowance: query.data as bigint, isLoadingAllowance: query.isLoading }
  }
  return { ...query, allowance: 0n, isLoadingAllowance: query.isLoading }
}
