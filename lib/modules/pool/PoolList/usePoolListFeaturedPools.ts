'use client'

import { getProjectConfig } from '@/lib/config/getProjectConfig'
import { GetFeaturedPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { useQuery } from '@apollo/experimental-nextjs-app-support/ssr'

export function usePoolListFeaturedPools() {
  const { supportedNetworks } = getProjectConfig()
  const { data, loading, networkStatus, error } = useQuery(GetFeaturedPoolsDocument, {
    variables: { chains: supportedNetworks },
  })

  return {
    featuredPools: data?.featuredPools || [],
    loading,
    error,
    networkStatus,
  }
}
