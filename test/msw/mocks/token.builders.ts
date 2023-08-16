import { TokenBase } from '@/lib/modules/tokens/token.types'
import { fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'

export function aTokenBase(...options: Partial<TokenBase>[]): TokenBase {
  const defaultToken: TokenBase = fakeTokenBySymbol('BAL')
  return Object.assign({}, defaultToken, ...options)
}
