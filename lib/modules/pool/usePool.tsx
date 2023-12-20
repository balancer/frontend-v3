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
import { usePoolHelpers } from './pool.helpers'
import { usePublicClient } from 'wagmi'
import { usePoolEnrichWithOnChainData } from '@/lib/modules/pool/usePoolEnrichWithOnChainData'
import { bn } from '@/lib/shared/utils/numbers'

export type UsePoolResponse = ReturnType<typeof _usePool> & {
  chain: GqlChain
}
export const PoolContext = createContext<UsePoolResponse | null>(null)

export type Pool = GetPoolQuery['pool']

export function _usePool({
  id,
  chain,
  variant,
  initialData,
}: FetchPoolProps & { initialData: GetPoolQuery }) {
  const config = getNetworkConfig(chain)
  const client = usePublicClient({ chainId: config.chainId })

  const { data } = useQuery(GetPoolDocument, {
    variables: { id },
    context: { headers: { ChainId: config.chainId } },
  })

  const {
    data: poolWithOnChainData,
    refetch,
    isLoading: loading,
  } = usePoolEnrichWithOnChainData({
    chain,
    pool: data?.pool || initialData.pool,
  })

  // fallbacks to ensure the pool is always present. We prefer the pool with on chain data
  const pool = poolWithOnChainData || data?.pool || initialData.pool

  const bptPrice = bn(pool.dynamicData.totalLiquidity).div(pool.dynamicData.totalShares).toFixed(2)

  return {
    pool,
    bptPrice,
    loading,
    // TODO: we assume here that we never need to reload the entire pool.
    // this assumption may need to be questioned
    refetch,
    ...usePoolHelpers(pool, chain),
  }
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
