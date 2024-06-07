import {
  GetPoolsQuery,
  GetPoolsQueryVariables,
  GqlChain,
  GqlPoolType,
  GqlPoolOrderBy,
  GqlPoolOrderDirection,
  GqlPoolFilterCategory,
} from '@/lib/shared/services/api/generated/graphql'
import {
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
  parseAsFloat,
} from 'next-usequerystate/parsers'
import { Hex } from 'viem'

export type PoolId = Hex

export type PoolList = GetPoolsQuery['pools']

export type PoolListItem = PoolList[0]

export enum BaseVariant {
  v2 = 'v2',
  v3 = 'v3',
}

// these variants support extra features in project config
export enum PartnerVariant {
  cow = 'cow',
}

export type PoolVariant = BaseVariant | PartnerVariant

export type PoolAction = 'add-liquidity' | 'remove-liquidity' | 'stake' | 'unstake'

export interface FetchPoolProps {
  id: string
  // chain & variant are not used yet, but will be needed in the future.
  chain: GqlChain
  variant?: PoolVariant
}

export interface PoolSearchParams {
  first?: string
  skip?: string
  orderBy?: string
  orderDirection?: string
  poolTypes?: string
  networks?: string
  textSearch?: string
  userAddress?: string
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

export const poolCategoryFilters = [
  //GqlPoolFilterCategory.BlackListed, NOT USED
  GqlPoolFilterCategory.Incentivized,
] as const

export type PoolCategoryType = (typeof poolCategoryFilters)[number]

export type SortingState = PoolsColumnSort[]

// We need to map toggalable pool types to their corresponding set of GqlPoolTypes.
export const POOL_TYPE_MAP: { [key in PoolFilterType]: GqlPoolType[] } = {
  [GqlPoolType.Weighted]: [GqlPoolType.Weighted],
  [GqlPoolType.Stable]: [GqlPoolType.Stable, GqlPoolType.ComposableStable, GqlPoolType.MetaStable],
  [GqlPoolType.LiquidityBootstrapping]: [GqlPoolType.LiquidityBootstrapping],
  [GqlPoolType.Gyro]: [GqlPoolType.Gyro, GqlPoolType.Gyro3, GqlPoolType.Gyroe],
}

export const orderByHash: { [key: string]: string } = {
  totalLiquidity: 'TVL',
  volume24h: 'Volume (24h)',
  apr: 'APR',
  userbalanceUsd: 'My liquidity',
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
  minTvl: parseAsFloat.withDefault(0),
  poolCategories: parseAsArrayOf(
    parseAsStringEnum<PoolCategoryType>(Object.values(poolCategoryFilters))
  ).withDefault([]),
}
