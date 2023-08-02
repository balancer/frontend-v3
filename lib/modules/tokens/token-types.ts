export interface TokenBase {
  address: string
  name: string
  symbol: string
  decimals: number
  chainId: number
}

export interface TokenAmountHumanReadable {
  address: string
  chainId: number
  amount: string
}
