import { GetPoolsDocument, GetTokensDocument } from '@/lib/services/api/generated/graphql'
import { getQueryName } from './utils'

describe('getQueryName', () => {
  test('works for TypedDocumentNode', () => {
    expect(getQueryName(GetTokensDocument)).toBe('GetTokens')
  })

  test('works for DocumentNode', () => {
    expect(getQueryName(GetPoolsDocument)).toBe('GetPools')
  })
})
