import { useAccount } from 'wagmi'
import { useEffect } from 'react'
import { useBoolean } from '@chakra-ui/hooks'

export function useUserAccount() {
  const query = useAccount()
  const [isFirstRender, setFirstRender] = useBoolean(true)

  useEffect(() => {
    setFirstRender.off()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    ...query,
    isLoading: query.isConnecting || isFirstRender,
    isConnecting: query.isConnecting || isFirstRender,
    userAddress: query.address,
    isConnected: !!query.address && !isFirstRender,
  }
}
