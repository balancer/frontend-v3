'use client'

import { GetUserDataDocument } from '@/lib/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { makeVar, useLazyQuery } from '@apollo/client'
import { PropsWithChildren, createContext, useEffect } from 'react'
import { useAccount } from 'wagmi'

export type UseUserDataResponse = ReturnType<typeof _useUserData>
export const UserDataContext = createContext<UseUserDataResponse | null>(null)

// Global user address variable for setting in Apollo headers.
export const userAddressVar = makeVar<string | undefined>(undefined)

export function _useUserData() {
  const { address } = useAccount()

  const [getUserData, { data }] = useLazyQuery(GetUserDataDocument)

  useEffect(() => {
    if (address !== userAddressVar()) {
      userAddressVar(address)
    }
    getUserData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  return {
    balances: data?.balances || [],
    staking: data?.staking || [],
    vebalBalance: data?.veBALUserBalance || '0',
  }
}

export function UserDataProvider({ children }: PropsWithChildren) {
  const hook = _useUserData()
  return <UserDataContext.Provider value={hook}>{children}</UserDataContext.Provider>
}

export const useUserData = (): UseUserDataResponse =>
  useMandatoryContext(UserDataContext, 'UserData')
