/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { GetPoolDocument, GetPoolQuery, GqlChain } from '@/lib/services/api/generated/graphql'
import { createContext, PropsWithChildren, useContext, useState } from 'react'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { BalancerVersion, FetchPoolProps } from './pool.types'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useApolloClient as apolloClient } from '@apollo/client'

export type UsePoolResponse = ReturnType<typeof _usePool>
export const PoolContext = createContext<UsePoolResponse | null>(null)

/**
 * Uses useSuspenseQuery to seed the client cache with initial pool data on the SSR pass.
 */
export const useSeedPoolCacheQuery = ({ id, chain, balancerVersion }: FetchPoolProps) => {
  const { chainId } = getNetworkConfig(chain)

  return useSuspenseQuery(GetPoolDocument, {
    variables: { id },
    context: { headers: { ChainId: chainId } },
  })
}

function _usePool({ id, chain, balancerVersion, initPool }: FetchPoolProps) {
  const { chainId } = getNetworkConfig(chain)
  const [mounted, setMounted] = useState(false)

  const { data, refetch, loading } = useQuery(GetPoolDocument, {
    variables: { id },
    context: { headers: { ChainId: chainId } },
  })

  if (!mounted) {
    apolloClient().writeQuery({
      query: GetPoolDocument,
      data: initPool,
      variables: { id },
    })
    setMounted(true)
  }

  if (!data?.pool && !initPool.pool) throw new Error(`Pool not found for id: ${id}`)

  const pool = data?.pool || initPool.pool

  return { pool, loading, refetch }
}

interface ProviderProps extends PropsWithChildren {
  id: string
  chain: GqlChain
  balancerVersion: BalancerVersion
  initPool: GetPoolQuery
}

export function PoolProvider({ id, chain, balancerVersion, initPool, children }: ProviderProps) {
  const hook = _usePool({ id, chain, balancerVersion, initPool })
  return <PoolContext.Provider value={hook}>{children}</PoolContext.Provider>
}

export const usePool = () => useContext(PoolContext) as UsePoolResponse
