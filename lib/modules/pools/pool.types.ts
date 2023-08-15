import { GetPoolsQuery, GqlChain } from '@/lib/services/api/generated/graphql'

export type PoolsList = GetPoolsQuery['pools']

export type PoolsListItem = PoolsList[0]

export type BalancerVersion = 'v2' | 'v3'

export interface FetchPoolProps {
  id: string
  // chain & balancerVersion are not used yet, but will be needed in the future.
  chain: GqlChain
  balancerVersion?: BalancerVersion
}

export enum PoolTypeFilter {
  Weighted = 'Weighted',
  Stable = 'Stable',
  LiquidityBootstrapping = 'Liquidity Bootstrapping',
}

export type PoolTypeFilterForm = Record<PoolTypeFilter, boolean>
export type PoolNetworkFilterForm = Record<GqlChain, boolean>
