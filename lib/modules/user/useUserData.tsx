'use client'

import { PropsWithChildren, createContext } from 'react'
import { useUserAccount } from '../web3/useUserAccount'
import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { GetUserDataDocument, GqlChain } from '@/lib/shared/services/api/generated/graphql'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'

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

  function getUserBalanceUSD(poolId: string, chain: GqlChain): number {
    const balance = data?.balances?.find(
      balance => balance.poolId === poolId && balance.chain === chain
    )

    return balance ? Number(balance.totalBalance) * balance.tokenPrice : 0
  }

  return {
    loading,
    balances: data?.balances || [],
    staking: data?.staking || [],
    vebalBalance: data?.veBALUserBalance || '0',
    getUserBalanceUSD,
  }
}

export function UserDataProvider({ children }: PropsWithChildren) {
  const hook = _useUserData()
  return <UserDataContext.Provider value={hook}>{children}</UserDataContext.Provider>
}

export const useUserData = (): UseUserDataResponse =>
  useMandatoryContext(UserDataContext, 'UserData')
