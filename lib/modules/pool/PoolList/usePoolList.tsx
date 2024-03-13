/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { createContext, ReactNode, useEffect } from 'react'
import { GetPoolsDocument, GetPoolsQuery } from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { usePoolListQueryState } from './usePoolListQueryState'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useUserAccount } from '../../web3/useUserAccount'
import { isAddress } from 'viem'
import { useSkipInitialQuery } from '@/lib/shared/hooks/useSkipInitialQuery'

export function _usePoolList(initialData: GetPoolsQuery) {
  const { queryVariables, toggleUserAddress } = usePoolListQueryState()
  const { userAddress } = useUserAccount()
  const skipQuery = useSkipInitialQuery(queryVariables)

  const { data, loading, previousData, refetch, networkStatus, error } = useQuery(
    GetPoolsDocument,
    {
      variables: queryVariables,
      //skip: skipQuery,
    }
  )

  const pools = loading && previousData ? previousData.pools : data?.pools || initialData.pools

  // If the user has previously selected to filter by their liquidity and then
  // changes their connected wallet, we want to automatically update the filter.
  useEffect(() => {
    if (isAddress(userAddress) && isAddress(queryVariables.where.userAddress || '')) {
      toggleUserAddress(true, userAddress)
    }
  }, [userAddress])

  return {
    pools,
    count: data?.count || previousData?.count || initialData.count,
    loading,
    error,
    networkStatus,
    refetch,
  }
}

export const PoolListContext = createContext<ReturnType<typeof _usePoolList> | null>(null)

export function PoolListProvider({ children, data }: { children: ReactNode; data: GetPoolsQuery }) {
  const hook = _usePoolList(data)

  return <PoolListContext.Provider value={hook}>{children}</PoolListContext.Provider>
}

export function usePoolList() {
  return useMandatoryContext(PoolListContext, 'PoolList')
}
