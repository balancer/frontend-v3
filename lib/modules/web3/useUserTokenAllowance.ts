import { Address } from 'wagmi'
import { useUserAccount } from './useUserAccount'
import { useIsMounted } from './useIsMounted'
import { nullAddress } from './contracts/wagmi-helpers'
import { useErc20Read } from './contracts/useErc20Read'

export function useUserTokenAllowance(tokenAddress: Address, spenderAddress: Address) {
  const { mounted } = useIsMounted()
  const { address } = useUserAccount()

  const query = useErc20Read(
    tokenAddress,
    'allowance',
    { args: [address || nullAddress, spenderAddress] },
    { enabled: !!address }
  )

  // TODO: fix type inference
  if (mounted && query.data) {
    return { ...query, allowance: query.data as bigint, isLoadingAllowance: query.isLoading }
  }
  return { ...query, allowance: 0n, isLoadingAllowance: query.isLoading }
}
