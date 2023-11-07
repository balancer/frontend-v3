import { aUserBalanceMock } from '@/lib/modules/user/__mocks__/userData.builders'
import { MswUserBalances } from '@/lib/modules/user/__mocks__/userData.test.types'
import { GetUserDataDocument } from '@/lib/shared/services/api/generated/graphql'
import { graphql } from 'msw'
import { getQueryName, mockGQL } from '../utils'

export const defaultUserBalanceMock = aUserBalanceMock()
export const defaultUserDataMock: MswUserBalances = [defaultUserBalanceMock as MswUserBalances[0]]

export function buildUserDataMswHandler(userBalances = defaultUserDataMock) {
  return graphql.query(getQueryName(GetUserDataDocument), (req, res, ctx) => {
    return res(ctx.data({ balances: userBalances }))
  })
}

export function mockUserData(tokenList = defaultUserDataMock) {
  mockGQL(buildUserDataMswHandler(tokenList))
}
