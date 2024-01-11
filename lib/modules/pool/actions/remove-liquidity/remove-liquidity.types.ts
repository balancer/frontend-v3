import {
  HumanAmount,
  RemoveLiquidityQueryOutput,
  RemoveLiquidityKind as SdkRemoveLiquidityKind,
  TokenAmount,
} from '@balancer/sdk'
import { Address } from 'wagmi'

type CommonRemoveLiquidityInputs = { account?: Address; slippagePercent?: string }

export type ProportionalRemoveLiquidityInputs = {
  humanBptIn: HumanAmount
} & CommonRemoveLiquidityInputs

export type SingleTokenRemoveLiquidityInputs = {
  humanBptIn: HumanAmount
  tokenOut: Address
} & CommonRemoveLiquidityInputs

export type RemoveLiquidityInputs =
  | ProportionalRemoveLiquidityInputs
  | SingleTokenRemoveLiquidityInputs

// sdkQueryOutput is optional because it will be only used in cases where we use the SDK to query/build the transaction
// We will probably need a more abstract interface to be used by edge cases
export type RemoveLiquidityOutputs = {
  amountsOut: TokenAmount[]
  sdkQueryOutput?: RemoveLiquidityQueryOutput
}

// sdkQueryOutput is optional because it will be only used in cases where we use the SDK to query/build the transaction
// We will probably need a more abstract interface to be used by edge cases
export type BuildLiquidityInputs = {
  inputs: RemoveLiquidityInputs
  sdkQueryOutput?: RemoveLiquidityQueryOutput
}

// There are other kinds but we only support two of them
export enum RemoveLiquidityType {
  Proportional = SdkRemoveLiquidityKind.Proportional,
  SingleToken = SdkRemoveLiquidityKind.SingleToken,
}
