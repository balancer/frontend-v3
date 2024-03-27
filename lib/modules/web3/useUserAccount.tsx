'use client'

/* eslint-disable react-hooks/exhaustive-deps */
// eslint-disable-next-line no-restricted-imports
import { useAccount, useDisconnect } from 'wagmi'
import { emptyAddress } from './contracts/wagmi-helpers'
import { useIsMounted } from './useIsMounted'
import { PropsWithChildren, createContext, useEffect, useState } from 'react'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { Address, isAddress } from 'viem'
import { COOKIE_KEYS } from '../cookies/cookie.constants'
import Cookies from 'js-cookie'
import { setTag, setUser } from '@sentry/nextjs'
import { config, isProd } from '@/lib/config/app.config'
import { captureError, ensureError } from '@/lib/shared/utils/errors'

async function isAuthorizedAddress(address: Address): Promise<boolean> {
  try {
    const res = await fetch(`/api/wallet-check/${address}`, { cache: 'no-store' })
    const data = await res.json()

    return data?.isAuthorized
  } catch (err) {
    const error = ensureError(err)
    if (isProd) captureError(error)
    return true
  }
}

export type UseUserAccountResponse = ReturnType<typeof _useUserAccount>
export const UserAccountContext = createContext<UseUserAccountResponse | null>(null)

export function _useUserAccount() {
  const { mounted } = useIsMounted()
  const query = useAccount()
  const { disconnect } = useDisconnect()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isBlocked, setIsBlocked] = useState(false)

  const { address, ...queryWithoutAddress } = query

  async function blockUnauthorizedAddress(address: Address | undefined) {
    if (!address || config.appEnv === 'test') {
      setCheckingAuth(false)
      return
    }

    let isAuthorized = true
    if (isAddress(address)) {
      isAuthorized = await isAuthorizedAddress(address)
      if (!isAuthorized) disconnect()
    }

    setIsBlocked(!isAuthorized)
    setCheckingAuth(false)
  }

  useEffect(() => {
    blockUnauthorizedAddress(address)
  }, [address])

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
    isLoading: !mounted || query.isConnecting || checkingAuth,
    isConnecting: !mounted || query.isConnecting || checkingAuth,
    // We use an emptyAddress when the user is not connected to avoid undefined value and satisfy the TS compiler
    userAddress: mounted ? query.address || emptyAddress : emptyAddress,
    isConnected: mounted && !!query.address && !checkingAuth,
    connector: mounted ? query.connector : undefined,
    isBlocked,
  }

  useEffect(() => {
    if (result.userAddress) {
      setUser({
        id: result.userAddress,
        username: result.userAddress,
      })
    } else {
      setUser(null)
    }
  }, [result.userAddress])

  useEffect(() => {
    setTag('wallet', result.connector?.id)
  }, [result.connector?.id])

  return result
}

export function UserAccountProvider({ children }: PropsWithChildren) {
  const hook = _useUserAccount()
  return <UserAccountContext.Provider value={hook}>{children}</UserAccountContext.Provider>
}

export const useUserAccount = (): UseUserAccountResponse =>
  useMandatoryContext(UserAccountContext, 'UserAccount')
