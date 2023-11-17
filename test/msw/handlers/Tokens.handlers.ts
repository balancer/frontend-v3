import {
  GetTokenPricesDocument,
  GetTokensDocument,
} from '@/lib/shared/services/api/generated/graphql'
import { graphql } from 'msw'
import { getQueryName, mockGQL } from '../utils'
import {
  defaultGetTokenPricesQueryMock,
  defaultTokenListMock,
} from '@/lib/modules/tokens/__mocks__/token.builders'

export function buildTokenListMswHandler(tokenList = defaultTokenListMock) {
  return graphql.query(getQueryName(GetTokensDocument), (req, res, ctx) => {
    return res(ctx.data({ tokens: tokenList }))
  })
}

export function mockTokenList(tokenList = defaultTokenListMock) {
  mockGQL(buildTokenListMswHandler(tokenList))
}

export function buildTokenPricesMswHandler(tokenList = defaultGetTokenPricesQueryMock) {
  return graphql.query(getQueryName(GetTokenPricesDocument), (req, res, ctx) => {
    return res(ctx.data({ tokens: tokenList }))
  })
}

export function mockTokenPricesList(tokenPricesList = defaultGetTokenPricesQueryMock) {
  mockGQL(buildTokenPricesMswHandler(tokenPricesList))
}
