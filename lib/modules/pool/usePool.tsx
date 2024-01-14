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
import { calcBptPrice, usePoolHelpers } from './pool.helpers'
import { useUserAccount } from '@/lib/modules/web3/useUserAccount'

import { usePoolEnrichWithOnChainData } from '@/lib/modules/pool/usePoolEnrichWithOnChainData'

export type UsePoolResponse = ReturnType<typeof _usePool> & {
  chain: GqlChain
}
export const PoolContext = createContext<UsePoolResponse | null>(null)

export type Pool = GetPoolQuery['pool']

export function _usePool({
  id,
  chain,
  initialData,
}: FetchPoolProps & { initialData: GetPoolQuery }) {
  const config = getNetworkConfig(chain)
  const { userAddress } = useUserAccount()

  const { data } = useQuery(GetPoolDocument, {
    variables: { id, chain, userAddress },
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
  const bptPrice = calcBptPrice(pool)

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
