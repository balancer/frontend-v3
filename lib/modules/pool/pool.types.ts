import {
  GetPoolsQuery,
  GetPoolsQueryVariables,
  GqlChain,
  GqlPoolOrderBy,
} from '@/lib/services/api/generated/graphql'

export type PoolList = GetPoolsQuery['pools']

export type PoolListItem = PoolList[0]

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

export interface PoolsQueryVariables extends GetPoolsQueryVariables {
  first: number
  skip: number
}
