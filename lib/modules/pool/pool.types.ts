import { GetPoolsQuery, GqlChain, GqlPoolOrderBy } from '@/lib/services/api/generated/graphql'

export type PoolList = GetPoolsQuery['pools']

export type PoolListItem = PoolList[0]

export type PoolVariant = 'v2' | 'v3'

export interface FetchPoolProps {
  id: string
  // chain & variant are not used yet, but will be needed in the future.
  chain: GqlChain
  variant?: PoolVariant
}

export interface PoolsColumnSort {
  id: GqlPoolOrderBy
  desc: boolean
}
