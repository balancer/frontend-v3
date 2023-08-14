/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { GetPoolDocument, GqlChain } from '@/lib/services/api/generated/graphql'
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { BalancerVersion, FetchPoolProps } from '../pool.types'
import { getNetworkConfig } from '@/lib/config/app.config'

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

function _usePool({ id, chain, balancerVersion }: FetchPoolProps) {
  const { chainId } = getNetworkConfig(chain)

  const { data, refetch, loading } = useQuery(GetPoolDocument, {
    variables: { id },
    context: { headers: { ChainId: chainId } },
  })

  if (!data?.pool) throw new Error(`Pool not found for id: ${id}`)

  const pool = data?.pool

  return { pool, loading, refetch }
}

interface ProviderProps extends PropsWithChildren {
  id: string
  chain: GqlChain
  balancerVersion: BalancerVersion
}

export function PoolProvider({ id, chain, balancerVersion, children }: ProviderProps) {
  const pools = _usePool({ id, chain, balancerVersion })
  return <PoolContext.Provider value={pools}>{children}</PoolContext.Provider>
}

export const usePool = () => useContext(PoolContext) as UsePoolResponse
