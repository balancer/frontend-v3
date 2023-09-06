import { GetPoolsQuery, GqlChain, GqlPoolOrderBy } from '@/lib/services/api/generated/graphql'

export type PoolsList = GetPoolsQuery['pools']

export type PoolsListItem = PoolsList[0]

export type BalancerVersion = 'v2' | 'v3'

export interface FetchPoolProps {
  id: string
  // chain & balancerVersion are not used yet, but will be needed in the future.
  chain: GqlChain
  balancerVersion?: BalancerVersion
}

export interface PoolsColumnSort {
  id: GqlPoolOrderBy
  desc: boolean
}
