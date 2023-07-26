import { GetPoolsQuery } from '@/lib/services/api/generated/graphql'

export type PoolsList = GetPoolsQuery['pools']

export type PoolsListItem = PoolsList[0]
