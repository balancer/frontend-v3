import {
  HumanAmount,
  RemoveLiquidityKind as SdkRemoveLiquidityKind,
  TokenAmount,
} from '@balancer/sdk'
import { Address } from 'wagmi'

// There are other kinds but we only support two of them
export enum RemoveLiquidityType {
  Proportional = SdkRemoveLiquidityKind.Proportional,
  SingleToken = SdkRemoveLiquidityKind.SingleToken,
}

export type ProportionalRemoveLiquidityInput = {
  humanBptIn: HumanAmount
}

export type SingleTokenRemoveLiquidityInput = {
  humanBptIn: HumanAmount
  tokenOut: Address
}

export type QueryRemoveLiquidityInput =
  | ProportionalRemoveLiquidityInput
  | SingleTokenRemoveLiquidityInput

export type QueryRemoveLiquidityOutput = {
  amountsOut: TokenAmount[]
}

export type BuildRemoveLiquidityInput = {
  account: Address
  slippagePercent: string
}
