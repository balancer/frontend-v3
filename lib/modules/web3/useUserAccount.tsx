'use client'

/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-restricted-imports
import { useAccount, useDisconnect } from 'wagmi'
import { emptyAddress } from './contracts/wagmi-helpers'
import { useIsMounted } from './useIsMounted'
import { PropsWithChildren, createContext, useEffect } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { Address, isAddress } from 'viem'
import { COOKIE_KEYS } from '../cookies/cookie.constants'
import Cookies from 'js-cookie'

async function isAuthorizedAddress(address: Address): Promise<boolean> {
  const res = await fetch(`/api/wallet-check/${address}`, { cache: 'no-store' })
  const data = await res.json()

  return data?.isAuthorized
}

export type UseUserAccountResponse = ReturnType<typeof _useUserAccount>
export const UserAccountContext = createContext<UseUserAccountResponse | null>(null)

export function _useUserAccount() {
  const { mounted } = useIsMounted()
  const query = useAccount()
  const { disconnect } = useDisconnect()

  const { address, ...queryWithoutAddress } = query

  useEffect(() => {
    if (address && isAddress(address)) {
      Cookies.set(COOKIE_KEYS.UserAddress, address)
    } else {
      Cookies.remove(COOKIE_KEYS.UserAddress)
    }
  }, [address])

  async function blockUnauthorizedAddress(address: Address | undefined) {
    console.log('blockUnauthorizedAddress', address)

    if (!address) return
    if (isAddress(address)) {
      const isAuthorized = await isAuthorizedAddress(address)
      if (!isAuthorized) disconnect()
    }
  }

  useEffect(() => {
    blockUnauthorizedAddress(address)
  }, [address])

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
    connector: mounted ? query.connector : undefined,
  }
}

export function UserAccountProvider({ children }: PropsWithChildren) {
  const hook = _useUserAccount()
  return <UserAccountContext.Provider value={hook}>{children}</UserAccountContext.Provider>
}

export const useUserAccount = (): UseUserAccountResponse =>
  useMandatoryContext(UserAccountContext, 'UserAccount')
