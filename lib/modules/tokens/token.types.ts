import { GqlToken } from '@/lib/shared/services/api/generated/graphql'

export type TokenBase = Pick<GqlToken, 'address' | 'name' | 'symbol' | 'decimals' | 'chainId'>

export interface TokenAmount {
  address: string
  chainId: number
  decimals: number
  amount: bigint
  formatted: string
}
