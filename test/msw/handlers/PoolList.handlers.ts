import { GetPoolsDocument } from '@/lib/shared/services/api/generated/graphql'
import { getQueryName, mockGQL } from '../utils'
import { graphql } from 'msw'
import { aGqlPoolMinimalMock } from '../builders/gqlPoolMinimal.builders'
import { PoolList } from '@/lib/modules/pool/pool.types'

export const defaultPoolListItemMock = aGqlPoolMinimalMock()
export const defaultPoolListMock: PoolList = [defaultPoolListItemMock]

export function buildPoolListMswHandler(poolList = defaultPoolListMock) {
  return graphql.query(getQueryName(GetPoolsDocument), (req, res, ctx) => {
    return res(ctx.data({ pools: poolList }))
  })
}

export function mockPoolList(poolList = defaultPoolListMock) {
  mockGQL(buildPoolListMswHandler(poolList))
}
