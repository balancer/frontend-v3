import {
  GetPoolsQuery,
  GetPoolsQueryVariables,
  GqlChain,
  GqlPoolType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
} from '@/lib/shared/services/api/generated/graphql'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from 'next-usequerystate/parsers'

export type PoolList = GetPoolsQuery['pools']

export type PoolListItem = PoolList[0]

export enum PoolVariant {
  v2 = 'v2',
  v3 = 'v3',
}

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

export interface PoolsQueryVariables extends GetPoolsQueryVariables {
  first: number
  skip: number
}

export const poolTypeFilters = [
  GqlPoolType.Weighted,
  GqlPoolType.Stable,
  GqlPoolType.LiquidityBootstrapping,
  GqlPoolType.Gyro,
] as const

export type PoolFilterType = (typeof poolTypeFilters)[number]

export type SortingState = PoolsColumnSort[]

// We need to map toggalable pool types to their corresponding set of GqlPoolTypes.
export const POOL_TYPE_MAP: { [key in PoolFilterType]: GqlPoolType[] } = {
  [GqlPoolType.Weighted]: [GqlPoolType.Weighted],
  [GqlPoolType.Stable]: [
    GqlPoolType.Stable,
    GqlPoolType.PhantomStable,
    GqlPoolType.MetaStable,
    GqlPoolType.Gyro,
    GqlPoolType.Gyro3,
    GqlPoolType.Gyroe,
  ],
  [GqlPoolType.LiquidityBootstrapping]: [GqlPoolType.LiquidityBootstrapping],
  [GqlPoolType.Gyro]: [GqlPoolType.Gyro, GqlPoolType.Gyro3, GqlPoolType.Gyroe],
}

export const orderByHash: { [key: string]: string } = {
  totalLiquidity: 'TVL',
  volume24h: 'Volume (24h)',
  apr: 'APR',
}

export const poolListQueryStateParsers = {
  first: parseAsInteger.withDefault(20),
  skip: parseAsInteger.withDefault(0),
  orderBy: parseAsStringEnum<GqlPoolOrderBy>(Object.values(GqlPoolOrderBy)).withDefault(
    GqlPoolOrderBy.TotalLiquidity
  ),
  orderDirection: parseAsStringEnum<GqlPoolOrderDirection>(
    Object.values(GqlPoolOrderDirection)
  ).withDefault(GqlPoolOrderDirection.Desc),
  poolTypes: parseAsArrayOf(
    parseAsStringEnum<PoolFilterType>(Object.values(poolTypeFilters))
  ).withDefault([]),
  networks: parseAsArrayOf(parseAsStringEnum<GqlChain>(Object.values(GqlChain))).withDefault([]),
  textSearch: parseAsString,
  userAddress: parseAsString,
}
