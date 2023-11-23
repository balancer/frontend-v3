'use client'

import {
  GetUserDataDocument,
  GetUserDataQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { makeVar, useQuery } from '@apollo/client'
import { PropsWithChildren, createContext, useContext } from 'react'
import { useAsyncEffect } from '../../utils/custom-hooks'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

const refetchingVar = makeVar(false)
const currentUserAddressVar = makeVar<string | null>(null)

export function _useUserData(variables: GetUserDataQueryVariables) {
  const { address: userAddress } = useUserAccount()

  const { data, loading, refetch, ...rest } = useQuery(GetUserDataDocument, {
    variables,
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'cache-first',
  })

  const currentUserAddress = currentUserAddressVar()
  const userAddressChanged = userAddress !== currentUserAddress

  useAsyncEffect(async () => {
    if (!refetchingVar()) {
      refetchingVar(true)
      await refetch()
      refetchingVar(false)
      currentUserAddressVar(userAddress)
    }
  }, [userAddress])

  function usdBalanceForPool(poolId: string): number {
    const balance = data?.balances.find(balance => balance.poolId === poolId)

    if (!balance) {
      return 0
    }

    return balance.tokenPrice * parseFloat(balance.totalBalance)
  }

  return {
    ...rest,
    loading: loading || userAddressChanged,
    refetch,
    usdBalanceForPool,
  }
}

export const UserDataContext = createContext<ReturnType<typeof _useUserData> | null>(null)

export function UserDataProvider({
  children,
  variables,
}: PropsWithChildren & { variables: GetUserDataQueryVariables }) {
  const data = _useUserData(variables)

  return <UserDataContext.Provider value={data}>{children}</UserDataContext.Provider>
}

export function useUserData() {
  return useContext(UserDataContext) as ReturnType<typeof _useUserData>
}
