import { GetTokensQuery } from '@/lib/services/api/generated/graphql'

export type TokenList = GetTokensQuery['tokens']

export type TokenBase = Pick<
  TokenList[number],
  'address' | 'name' | 'symbol' | 'decimals' | 'chainId'
>

export interface TokenAmount {
  address: string
  chainId: number
  decimals: number
  amount: bigint
  formatted: string
}
