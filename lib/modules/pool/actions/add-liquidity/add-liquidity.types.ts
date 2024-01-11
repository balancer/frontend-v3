import { TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

export type QueryAddLiquidityOutput = {
  bptOut: TokenAmount
}

export type BuildAddLiquidityInputs = {
  account: Address
  slippagePercent: string
}
