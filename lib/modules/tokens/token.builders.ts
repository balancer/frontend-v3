import { TokenAmount } from './token.types'

export function aTokenAmount(options?: Partial<TokenAmount>) {
  const defaultTokenAmount = {
    address: '0xc67b12049c2d0cf6e476bc64c7f82fc6c63cffc5',
    amount: 0n,
    chainId: 1,
    decimals: 8,
    formatted: '0',
  }
  return Object.assign({}, defaultTokenAmount, options)
}

export function someTokenAmounts(addresses: string[]) {
  return addresses.map(address => aTokenAmount({ address }))
}
