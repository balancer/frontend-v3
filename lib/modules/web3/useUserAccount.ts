// eslint-disable-next-line no-restricted-imports
import { Address, useAccount } from 'wagmi'
import { useIsMounted } from './useIsMounted'

// Used when the user is not connected to avoid undefined value to make TS compile
const NOT_CONNECTED_USER: Address = '0x_NOT_CONNECTED_USER'

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
    userAddress: mounted ? query.address || NOT_CONNECTED_USER : NOT_CONNECTED_USER,
    isConnected: mounted && !!query.address,
  }
}
