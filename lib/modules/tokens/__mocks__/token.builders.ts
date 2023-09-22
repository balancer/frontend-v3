import { TokenAmount } from '../token.types'
import { TokenBase } from '@/lib/modules/tokens/token.types'
import { fakeTokenBySymbol } from '@/test/data/all-gql-tokens.fake'

export function aTokenAmountMock(options?: Partial<TokenAmount>) {
  const defaultTokenAmount = {
    address: '0xc67b12049c2d0cf6e476bc64c7f82fc6c63cffc5',
    amount: 0n,
    chainId: 1,
    decimals: 8,
    formatted: '0',
  }
  return Object.assign({}, defaultTokenAmount, options)
}

export function someTokenAmountsMock(addresses: string[]) {
  return addresses.map(address => aTokenAmountMock({ address }))
}

export function aTokenBaseMock(...options: Partial<TokenBase>[]): TokenBase {
  const defaultToken: TokenBase = fakeTokenBySymbol('BAL')
  return Object.assign({}, defaultToken, ...options)
}
