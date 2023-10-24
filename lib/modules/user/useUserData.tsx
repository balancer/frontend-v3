'use client'

import { GetUserDataDocument } from '@/lib/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/utils/contexts'
import { useLazyQuery } from '@apollo/client'
import { DependencyList, PropsWithChildren, createContext, useEffect } from 'react'
import { useUserAccount } from '../web3/useUserAccount'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'

export type UseUserDataResponse = ReturnType<typeof _useUserData>
export const UserDataContext = createContext<UseUserDataResponse | null>(null)

export function _useUserData() {
  const { userAddress } = useUserAccount()
  const { supportedNetworks } = getProjectConfig()

  const { data, loading } = useQuery(GetUserDataDocument, {
    variables: {
      chains: supportedNetworks,
      address: userAddress,
    },
  })

  return {
    loading,
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
