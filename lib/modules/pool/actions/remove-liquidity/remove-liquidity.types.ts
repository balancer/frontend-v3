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

export type ProportionalRemoveLiquidityInputs = {
  humanBptIn: HumanAmount
}

export type SingleTokenRemoveLiquidityInputs = {
  humanBptIn: HumanAmount
  tokenOut: Address
}

export type QueryRemoveLiquidityInputs =
  | ProportionalRemoveLiquidityInputs
  | SingleTokenRemoveLiquidityInputs

export type QueryRemoveLiquidityOutput = {
  amountsOut: TokenAmount[]
}

export type BuildRemoveLiquidityInputs = {
  account: Address
  slippagePercent: string
}
