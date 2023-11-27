import {
  defaultGetTokenPricesQueryMock,
  defaultTokenListMock,
} from '@/lib/modules/tokens/__mocks__/token.builders'
import {
  GetTokenPricesDocument,
  GetTokensDocument,
} from '@/lib/shared/services/api/generated/graphql'
import { graphql } from 'msw'
import { getQueryName, mockGQL } from '../utils'
import { GQLResponse } from './msw-helpers'

export function buildTokenListMswHandler(tokenList = defaultTokenListMock) {
  return graphql.query(getQueryName(GetTokensDocument), () => {
    return GQLResponse({ tokens: tokenList })
  })
}

export function mockTokenList(tokenList = defaultTokenListMock) {
  mockGQL(buildTokenListMswHandler(tokenList))
}

export function buildTokenPricesMswHandler(tokenList = defaultGetTokenPricesQueryMock) {
  return graphql.query(getQueryName(GetTokenPricesDocument), () => {
    return GQLResponse({ tokens: tokenList })
  })
}

export function mockTokenPricesList(tokenPricesList = defaultGetTokenPricesQueryMock) {
  mockGQL(buildTokenPricesMswHandler(tokenPricesList))
}
