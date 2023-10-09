import { GetTokensDocument } from '@/lib/services/api/generated/graphql'
import { getQueryName, mockGQL } from '../utils'
import { graphql } from 'msw'
import { MswTokenList } from '@/lib/modules/tokens/__mocks__/token.test.types'
import { aTokenBaseMock } from '@/lib/modules/tokens/__mocks__/token.builders'

export const defaultTokenBaseMock = aTokenBaseMock({ symbol: 'TEST-TOKEN' })
export const defaultTokenListMock: MswTokenList = [defaultTokenBaseMock as MswTokenList[0]]

export function buildTokenListMswHandler(tokenList = defaultTokenListMock) {
  return graphql.query(getQueryName(GetTokensDocument), (req, res, ctx) => {
    return res(ctx.data({ tokens: tokenList }))
  })
}

export function mockTokenList(tokenList = defaultTokenListMock) {
  mockGQL(buildTokenListMswHandler(tokenList))
}
