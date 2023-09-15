import { GetPoolsDocument } from '@/lib/services/api/generated/graphql'
import { getQueryName, mockGQL } from '../utils'
import { graphql } from 'msw'
import { aGqlPoolMinimal } from './gqlPoolMinimal.builders'
import { PoolList } from '@/lib/modules/pool/pool.types'

export const defaultPoolListItem1 = aGqlPoolMinimal()
export const defaultPoolList: PoolList = [defaultPoolListItem1]

export function buildPoolListHandler(poolList = defaultPoolList) {
  return graphql.query(getQueryName(GetPoolsDocument), (req, res, ctx) => {
    return res(ctx.data({ pools: poolList }))
  })
}

export function mockPoolList(poolList = defaultPoolList) {
  mockGQL(buildPoolListHandler(poolList))
}
