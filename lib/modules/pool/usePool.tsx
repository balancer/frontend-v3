/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import {
  GetPoolDocument,
  GetPoolQuery,
  GetPoolQueryVariables,
  GqlChain,
} from '@/lib/shared/services/api/generated/graphql'
import { createContext, PropsWithChildren } from 'react'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'
import { FetchPoolProps } from './pool.types'
import { getNetworkConfig } from '@/lib/config/app.config'
import { useMandatoryContext } from '@/lib/shared/utils/contexts'
import { useSeedApolloCache } from '@/lib/shared/hooks/useSeedApolloCache'
import { buildGqlPoolHelpers } from './pool.helpers'

export type UsePoolResponse = ReturnType<typeof _usePool> & {
  chain: GqlChain
}
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

  const poolHelpers = buildGqlPoolHelpers(pool, chain)

  return { pool, poolHelpers, loading, refetch }
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
  const payload = {
    ...hook,
    chain,
  }
  return <PoolContext.Provider value={payload}>{children}</PoolContext.Provider>
}

export const usePool = (): UsePoolResponse => useMandatoryContext(PoolContext, 'Pool')
