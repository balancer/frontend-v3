import { useErc20Read } from '@/lib/contracts/useErc20Read'
import { nullAddress } from '@/lib/contracts/wagmi-helpers'
import { Address } from 'wagmi'
import { useUserAccount } from './useUserAccount'
import { useIsMounted } from './useIsMounted'

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
    return { ...query, allowance: query.data as bigint }
  }
  return { ...query, allowance: 0n }
}
