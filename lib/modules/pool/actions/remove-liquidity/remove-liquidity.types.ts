import {
  HumanAmount,
  RemoveLiquidityQueryOutput,
  RemoveLiquidityKind as SdkRemoveLiquidityKind,
  TokenAmount,
} from '@balancer/sdk'
import { Address } from 'wagmi'

// There are other kinds but we only support two of them
export enum RemoveLiquidityType {
  Proportional = SdkRemoveLiquidityKind.Proportional,
  SingleToken = SdkRemoveLiquidityKind.SingleToken,
}

/*
  Base interface that every handler must implement.
  - SDK handlers will extend it with sdk fields (see interfaces below).
  - Edge case handlers (i.e. TWAMM handler) that do not use the SDK will just implement this base interface without extending it.
*/
export interface BaseQueryRemoveLiquidityInput {
  humanBptIn: HumanAmount
  tokenOut: Address // Only SingleToken handler uses tokenOut but we define it here to simply optional type handling
}
export interface SingleTokenRemoveLiquidityInput {
  humanBptIn: HumanAmount
  tokenOut: Address
}

export type QueryRemoveLiquidityInput =
  | BaseQueryRemoveLiquidityInput
  | SingleTokenRemoveLiquidityInput

export type QueryRemoveLiquidityOutput = {
  amountsOut: TokenAmount[]
}

export type BuildRemoveLiquidityInput = {
  account: Address
  slippagePercent: string
  queryOutput: QueryRemoveLiquidityOutput
}

/*
  SDK interfaces:
  They extend the base QueryAddLiquidityOutput interface above.
  Implemented by the default handlers (i.e. UnbalancedAddLiquidity or NestedAddLiquidityHandler)
  which interact with the SDK to query and build the tx callData.
*/
export interface SdkQueryRemoveLiquidityOutput extends QueryRemoveLiquidityOutput {
  sdkQueryOutput: RemoveLiquidityQueryOutput
}

export interface SdkBuildRemoveLiquidityInput extends BuildRemoveLiquidityInput {
  queryOutput: SdkQueryRemoveLiquidityOutput
}
