'use client'
// eslint-disable-next-line no-restricted-imports
import { useAccount } from 'wagmi'
import { emptyAddress } from './contracts/wagmi-helpers'
import { useIsMounted } from './useIsMounted'
import { PropsWithChildren, createContext, useEffect } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { isAddress } from 'viem'
import { COOKIE_KEYS } from '../cookies/cookie.constants'
import Cookies from 'js-cookie'
import { setTag, setUser } from '@sentry/nextjs'

export type UseUserAccountResponse = ReturnType<typeof _useUserAccount>
export const UserAccountContext = createContext<UseUserAccountResponse | null>(null)

export function _useUserAccount() {
  const { mounted } = useIsMounted()
  const query = useAccount()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { address, ...queryWithoutAddress } = query

  useEffect(() => {
    if (address && isAddress(address)) {
      Cookies.set(COOKIE_KEYS.UserAddress, address)
    } else {
      Cookies.remove(COOKIE_KEYS.UserAddress)
    }
  }, [address])

  // The usage of mounted helps to overcome nextjs hydration mismatch
  // errors where the state of the user account on the server pass is different
  // than the state on the client side rehydration.
  const result = {
    ...queryWithoutAddress,
    isLoading: !mounted || query.isConnecting,
    isConnecting: !mounted || query.isConnecting,
    // We use an emptyAddress when the user is not connected to avoid undefined value and satisfy the TS compiler
    userAddress: mounted ? query.address || emptyAddress : emptyAddress,
    isConnected: mounted && !!query.address,
    connector: mounted ? query.connector : undefined,
  }

  if (result.userAddress) {
    setUser({
      id: result.userAddress,
      username: result.userAddress,
    })
  } else {
    setUser(null)
  }

  setTag('wallet', result.connector?.id || 'none')

  return result
}

export function UserAccountProvider({ children }: PropsWithChildren) {
  const hook = _useUserAccount()
  return <UserAccountContext.Provider value={hook}>{children}</UserAccountContext.Provider>
}

export const useUserAccount = (): UseUserAccountResponse =>
  useMandatoryContext(UserAccountContext, 'UserAccount')
