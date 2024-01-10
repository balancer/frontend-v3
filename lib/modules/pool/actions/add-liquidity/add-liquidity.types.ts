import { AddLiquidityQueryOutput, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'
import { HumanAmountIn } from '../liquidity-types'
import { UnbalancedAddLiquidityHandler } from './handlers/UnbalancedAddLiquidity.handler'
import { TwammAddLiquidityHandler } from './handlers/TwammAddLiquidity.handler'

export type SupportedHandler = UnbalancedAddLiquidityHandler | TwammAddLiquidityHandler

export type SdkQueryAddLiquidityOutput = {
  bptOut: TokenAmount
  sdkQueryOutput: AddLiquidityQueryOutput
}

export type TwammQueryAddLiquidityOutput = {
  bptOut: TokenAmount
}

// Default handlers (UnbalancedAddLiquidityHandler) that use the SDK to query/build the transaction will return sdkQueryOutput
// Edge-case handlers (TwammAddLiquidityHandler) that do not use the SDK edge-case handlers will not return sdkQueryOutput
export type QueryAddLiquidityOutput<Handler extends SupportedHandler> =
  Handler extends UnbalancedAddLiquidityHandler
    ? SdkQueryAddLiquidityOutput
    : TwammQueryAddLiquidityOutput

export type SdkBuildAddLiquidityInputs = {
  humanAmountsIn: HumanAmountIn[]
  account: Address
  slippagePercent: string
  bptOut: TokenAmount
  sdkQueryOutput: AddLiquidityQueryOutput
}

export type TwammBuildAddLiquidityInputs = {
  humanAmountsIn: HumanAmountIn[]
  account: Address
  slippagePercent: string
  bptOut: TokenAmount
}

export type BuildAddLiquidityInputs<Handler extends SupportedHandler> =
  Handler extends UnbalancedAddLiquidityHandler
    ? SdkBuildAddLiquidityInputs
    : TwammBuildAddLiquidityInputs
