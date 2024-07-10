/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, ReactNode, useEffect } from 'react'
import { GetPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { usePoolListQueryState } from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useUserAccount } from '../../web3/UserAccountProvider'
import { isAddress } from 'viem'
import { ApiErrorAlert } from '@/lib/shared/components/errors/ApiErrorAlert'

export function _usePoolList() {
  const { queryVariables, toggleUserAddress } = usePoolListQueryState()
  const { userAddress } = useUserAccount()

  const { data, loading, previousData, refetch, networkStatus, error } = useQuery(
    GetPoolsDocument,
    {
      variables: queryVariables,
    }
  )

  const pools = loading && previousData ? previousData.pools : data?.pools || []

  // If the user has previously selected to filter by their liquidity and then
  // changes their connected wallet, we want to automatically update the filter.
  useEffect(() => {
    if (isAddress(userAddress) && isAddress(queryVariables.where.userAddress || '')) {
      toggleUserAddress(true, userAddress)
    }
  }, [userAddress])

  return {
    pools,
    count: data?.count || previousData?.count,
    loading,
    error,
    networkStatus,
    refetch,
  }
}

export const PoolListContext = createContext<ReturnType<typeof _usePoolList> | null>(null)

export function PoolListProvider({ children }: { children: ReactNode }) {
  const hook = _usePoolList()

  if (hook.error) {
    return <ApiErrorAlert />
  }

  return <PoolListContext.Provider value={hook}>{children}</PoolListContext.Provider>
}

export function usePoolList() {
  return useMandatoryContext(PoolListContext, 'PoolList')
}
