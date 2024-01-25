import { AddLiquidityQueryOutput, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'
import { HumanAmountIn } from '../liquidity-types'

/*
  Base interface that every handler must implement.
  - SDK handlers will extend it with sdk fields (see interfaces below).
  - Edge case handlers (i.e. TWAMM handler) that do not use the SDK will just implement this base interface without extending it.
*/
export interface QueryAddLiquidityOutput {
  bptOut: TokenAmount
}

export interface BuildAddLiquidityInput {
  humanAmountsIn: HumanAmountIn[]
  account: Address
  slippagePercent: string
  queryOutput: QueryAddLiquidityOutput
}

/*
  SDK interfaces:
  They extend the base QueryAddLiquidityOutput interface above.
  Implemented by the default handlers (i.e. UnbalancedAddLiquidity or NestedAddLiquidityHandler)
  which interact with the SDK to query and build the tx callData.
*/
export interface SdkQueryAddLiquidityOutput extends QueryAddLiquidityOutput {
  sdkQueryOutput: AddLiquidityQueryOutput
}

export interface SdkBuildAddLiquidityInput extends BuildAddLiquidityInput {
  queryOutput: SdkQueryAddLiquidityOutput
}
