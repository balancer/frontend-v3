// eslint-disable-next-line no-restricted-imports
import { useAccount } from 'wagmi'
import { useIsMounted } from './useIsMounted'

export function useUserAccount() {
  const { mounted } = useIsMounted()
  const query = useAccount()

  // The usage of mounted helps to overcome nextjs hydration mismatch
  // errors where the state of the user account on the server pass is different
  // than the state on the client side rehydration.
  return {
    ...query,
    isLoading: !mounted || query.isConnecting,
    isConnecting: !mounted || query.isConnecting,
    userAddress: mounted ? query.address : undefined,
    isConnected: mounted && !!query.address,
  }
}
