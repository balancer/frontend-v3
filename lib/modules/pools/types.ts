import { GetPoolsQuery } from '@/lib/services/api/generated/types'

export type PoolsList = GetPoolsQuery['pools']

export type PoolsListItem = PoolsList[0]
