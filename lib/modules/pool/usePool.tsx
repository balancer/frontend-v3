/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { GetPoolDocument, GetPoolQuery } from '@/lib/shared/services/api/generated/graphql'
import { createContext, PropsWithChildren, useRef } from 'react'
import { useQuery, useSuspenseQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { FetchPoolProps } from './pool.types'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useApolloClient } from '@apollo/client'

export type UsePoolResponse = ReturnType<typeof _usePool>
export const PoolContext = createContext<UsePoolResponse | null>(null)

/**
 * Uses useSuspenseQuery to seed the client cache with initial pool data on the SSR pass.
 */
export const useSeedPoolCacheQuery = ({ id, chain, variant }: FetchPoolProps) => {
  const { chainId } = getNetworkConfig(chain)

  return useSuspenseQuery(GetPoolDocument, {
    variables: { id },
    context: { headers: { ChainId: chainId } },
  })
}

export function _usePool({ id, chain, variant }: FetchPoolProps) {
  const { chainId } = getNetworkConfig(chain)

  const { data, refetch, loading } = useQuery(GetPoolDocument, {
    variables: { id },
    context: { headers: { ChainId: chainId } },
  })

  const pool = data!.pool!

  return { pool, loading, refetch }
}

export function PoolProvider({
  id,
  chain,
  variant,
  children,
  initialQuery,
}: PropsWithChildren<FetchPoolProps> & { initialQuery: GetPoolQuery }) {
  const loaded = useRef(false)
  const client = useApolloClient()

  if (!loaded.current) {
    console.log('loading data')
    client.writeQuery({
      query: GetPoolDocument,
      data: initialQuery,
      variables: { id },
    })

    loaded.current = true
  }

  const hook = _usePool({ id, chain, variant })
  return <PoolContext.Provider value={hook}>{children}</PoolContext.Provider>
}

export const usePool = (): UsePoolResponse => useMandatoryContext(PoolContext, 'Pool')
