import { RemoveLiquidityQueryOutput, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'
import { HumanAmountIn } from '../liquidity-types'

export type RemoveLiquidityInputs = {
  humanAmountsIn: HumanAmountIn[]
  account?: Address
  slippagePercent?: string
}

// sdkQueryOutput is optional because it will be only used in cases where we use the SDK to query/build the transaction
// We will probably need a more abstract interface to be used by edge cases
export type RemoveLiquidityOutputs = {
  bptIn: TokenAmount
  sdkQueryOutput?: RemoveLiquidityQueryOutput
}

// sdkQueryOutput is optional because it will be only used in cases where we use the SDK to query/build the transaction
// We will probably need a more abstract interface to be used by edge cases
export type BuildLiquidityInputs = {
  inputs: RemoveLiquidityInputs
  sdkQueryOutput?: RemoveLiquidityQueryOutput
}
