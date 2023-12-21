import {
  RemoveLiquidityKind as SdkRemoveLiquidityKind,
  RemoveLiquidityQueryOutput,
  TokenAmount,
  HumanAmount,
} from '@balancer/sdk'
import { Address } from 'wagmi'

type ProportionalRemoveLiquidityInputs = {
  humanBptIn: HumanAmount | ''
}

type SingleTokenRemoveLiquidityInputs = {
  humanBptIn: HumanAmount | ''
}

// ProportionalRemoveLiquidityInputs and SingleTokenRemoveLiquidityInputs have currently the same shape
// but we prefer to keep this interface explicit (in the future there could be divergence or new types like Unbalanced kind)
export type RemoveLiquidityInputs = (
  | ProportionalRemoveLiquidityInputs
  | SingleTokenRemoveLiquidityInputs
) & { account?: Address; slippagePercent?: string }

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
