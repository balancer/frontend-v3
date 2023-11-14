import {
  GetTokenPricesQuery,
  GetTokensDocument,
  GetTokensQuery,
  GetTokensQueryVariables,
} from '@/lib/shared/services/api/generated/graphql'
import { getQueryName, mockGQL } from '../utils'
import { graphql } from 'msw'
import { MswTokenList } from '@/lib/modules/tokens/__mocks__/token.test.types'
import { aTokenBaseMock } from '@/lib/modules/tokens/__mocks__/token.builders'
import { mock } from 'vitest-mock-extended'

export const defaultTokenBaseMock = aTokenBaseMock({ symbol: 'TEST-TOKEN' })
export const defaultTokenListMock: MswTokenList = [defaultTokenBaseMock as MswTokenList[0]]

export const defaultGetTokensQueryMock: GetTokensQuery = mock<GetTokensQuery>()
export const defaultGetTokenPricesQueryMock: GetTokenPricesQuery = mock<GetTokenPricesQuery>()
export const defaultGetTokensQueryVariablesMock: GetTokensQueryVariables =
  mock<GetTokensQueryVariables>()

export function buildTokenListMswHandler(tokenList = defaultTokenListMock) {
  return graphql.query(getQueryName(GetTokensDocument), (req, res, ctx) => {
    return res(ctx.data({ tokens: tokenList }))
  })
}

export function mockTokenList(tokenList = defaultTokenListMock) {
  mockGQL(buildTokenListMswHandler(tokenList))
}
