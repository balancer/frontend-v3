import { Address } from 'wagmi'
import { useConnectedUser } from '../user/settings/useConnectedUser'
import { useErc20Read } from './contracts/useErc20Read'
import { useIsMounted } from './useIsMounted'

export function useUserTokenAllowance(tokenAddress: Address, spenderAddress: Address) {
  const { mounted } = useIsMounted()
  const userAddress = useConnectedUser()

  const query = useErc20Read(
    tokenAddress,
    'allowance',
    { args: [userAddress, spenderAddress] },
    { enabled: true }
  )

  // TODO: fix type inference
  if (mounted && query.data) {
    return { ...query, allowance: query.data as bigint, isLoadingAllowance: query.isLoading }
  }
  return { ...query, allowance: 0n, isLoadingAllowance: query.isLoading }
}
