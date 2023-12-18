import { RemoveLiquidityQueryOutput, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

export type RemoveLiquidityInputs = {
  bptIn: string // not sure exactly what type this should be yet.
  singleTokenOut?: Address // The token address when removing liquidity for a single token.
  account?: Address
  slippagePercent?: string
}

// sdkQueryOutput is optional because it will be only used in cases where we use the SDK to query/build the transaction
// We will probably need a more abstract interface to be used by edge cases
export type RemoveLiquidityOutputs = {
  amountsOut: TokenAmount[]
}

// sdkQueryOutput is optional because it will be only used in cases where we use the SDK to query/build the transaction
// We will probably need a more abstract interface to be used by edge cases
export type BuildLiquidityInputs = {
  inputs: RemoveLiquidityInputs
  sdkQueryOutput?: RemoveLiquidityQueryOutput
}
