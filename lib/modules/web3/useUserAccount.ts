// eslint-disable-next-line no-restricted-imports
import { useAccount } from 'wagmi'
import { emptyAddress } from './contracts/wagmi-helpers'
import { useIsMounted } from './useIsMounted'

export function useUserAccount() {
  const { mounted } = useIsMounted()
  const query = useAccount()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { address, ...queryWithoutAddress } = query

  // The usage of mounted helps to overcome nextjs hydration mismatch
  // errors where the state of the user account on the server pass is different
  // than the state on the client side rehydration.
  return {
    ...queryWithoutAddress,
    isLoading: !mounted || query.isConnecting,
    isConnecting: !mounted || query.isConnecting,
    // We use an emptyAddress when the user is not connected to avoid undefined value and satisfy the TS compiler
    userAddress: mounted ? query.address || emptyAddress : emptyAddress,
    isConnected: mounted && !!query.address,
  }
}
