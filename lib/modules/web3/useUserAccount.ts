// eslint-disable-next-line no-restricted-imports
import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useBoolean } from '@chakra-ui/hooks'
import { makeVar } from '@apollo/client'

// Global user address variable for setting in Apollo headers.
export const userAddressVar = makeVar<string | undefined>(undefined)

export function useUserAccount() {
  const query = useAccount()
  const [isFirstRender, setFirstRender] = useBoolean(true)

  useEffect(() => {
    setFirstRender.off()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (query.address !== userAddressVar()) {
      userAddressVar(query.address)
    }
  }, [query.address])

  // The usage of isFirstRender helps to overcome nextjs hydration mismatch
  // errors where the state of the user account on the server pass is different
  // than the state on the client side rehydration.
  return {
    ...query,
    isLoading: query.isConnecting || isFirstRender,
    isConnecting: query.isConnecting || isFirstRender,
    userAddress: query.address,
    isConnected: !!query.address && !isFirstRender,
  }
}
