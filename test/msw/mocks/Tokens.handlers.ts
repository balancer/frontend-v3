import { GetTokensDocument } from '@/lib/services/api/generated/graphql'
import { getQueryName, mockGQL } from '../utils'
import { graphql } from 'msw'
import { TokenList } from '@/lib/modules/tokens/token.types'
import { aTokenBase } from './token.builders'

export const defaultTokenBase = aTokenBase({ symbol: 'TEST-TOKEN' })
export const defaultTokenList: TokenList = [defaultTokenBase as TokenList[0]]

export function buildTokenListHandler(tokenList = defaultTokenList) {
  return graphql.query(getQueryName(GetTokensDocument), (req, res, ctx) => {
    return res(ctx.data({ tokens: tokenList }))
  })
}

export function mockTokenList(tokenList = defaultTokenList) {
  mockGQL(buildTokenListHandler(tokenList))
}
