import { GetTokensDocument } from '@/lib/services/api/generated/graphql'
import { getQueryName, mockGQL } from '../utils'
import { graphql } from 'msw'
import { MswTokenList } from '@/lib/modules/tokens/token.msw.types'
import { aTokenBase } from './token.builders'

export const defaultTokenBase = aTokenBase({ symbol: 'TEST-TOKEN' })
export const defaultMswTokenList: MswTokenList = [defaultTokenBase as MswTokenList[0]]

export function buildTokenListHandler(tokenList = defaultMswTokenList) {
  return graphql.query(getQueryName(GetTokensDocument), (req, res, ctx) => {
    return res(ctx.data({ tokens: tokenList }))
  })
}

export function mockTokenList(tokenList = defaultMswTokenList) {
  mockGQL(buildTokenListHandler(tokenList))
}
