/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import {
  GetPoolDocument,
  GetPoolQuery,
  GetPoolQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { createContext, PropsWithChildren } from 'react'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { FetchPoolProps } from '@/lib/modules/pool/pool.types'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'

export type UsePoolResponse = ReturnType<typeof _usePool>
export const PoolContext = createContext<UsePoolResponse | null>(null)

export function _usePool({
  id,
  chain,
  variant,
  initialData,
}: FetchPoolProps & { initialData: GetPoolQuery }) {
  const { chainId } = getNetworkConfig(chain)

  const { data, refetch, loading } = useQuery(GetPoolDocument, {
    variables: { id },
    context: { headers: { ChainId: chainId } },
  })

  const pool = data?.pool || initialData.pool

  return { pool, loading, refetch }
}

export function PoolProvider({
  id,
  chain,
  variant,
  children,
  data,
  variables,
}: PropsWithChildren<FetchPoolProps> & { data: GetPoolQuery; variables: GetPoolQueryVariables }) {
  useSeedApolloCache({
    query: GetPoolDocument,
    data,
    variables,
  })

  const hook = _usePool({ id, chain, variant, initialData: data })
  return <PoolContext.Provider value={hook}>{children}</PoolContext.Provider>
}

export const usePool = (): UsePoolResponse => useMandatoryContext(PoolContext, 'Pool')
