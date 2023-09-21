export interface TokenBase {
  address: string
  name: string
  symbol: string
  decimals: number
  chainId: number
}

export interface TokenAmount {
  address: string
  chainId: number
  decimals: number
  amount: bigint
  formatted: string
}
