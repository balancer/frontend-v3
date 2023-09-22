import { GetPoolDocument } from '@/lib/services/api/generated/graphql'
import { graphql } from 'msw'
import { getQueryName, mockGQL } from '../utils'
import { aGqlPoolElementMock } from '../builders/gqlPoolElement.builders'

export const defaultPool = aGqlPoolElementMock()

export function buildPoolHandler(pool = defaultPool) {
  return graphql.query(getQueryName(GetPoolDocument), (req, res, ctx) => {
    return res(ctx.data({ pool: pool }))
  })
}

export function mockPool(pool = defaultPool) {
  mockGQL(buildPoolHandler(pool))
}
