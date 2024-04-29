import {
  GetSorSwapsQuery,
  GqlChain,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import { ExactInQueryOutput, ExactOutQueryOutput, Swap, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

export type SwapTokenInput = {
  address: Address
  amount: string
  scaledAmount: bigint
}

export type SwapState = {
  tokenIn: SwapTokenInput
  tokenOut: SwapTokenInput
  swapType: GqlSorSwapType
  selectedChain: GqlChain
}

export type SimulateSwapInputs = {
  chain: GqlChain
  tokenIn: Address
  tokenOut: Address
  swapType: GqlSorSwapType
  swapAmount: string
}

type ApiSwapQuery = GetSorSwapsQuery['swaps']

export type SimulateSwapResponse = Pick<
  ApiSwapQuery,
  'effectivePrice' | 'effectivePriceReversed' | 'returnAmount' | 'priceImpact' | 'swapType'
>

export interface SdkSimulateSwapResponse extends SimulateSwapResponse, ApiSwapQuery {
  swap: Swap
  queryOutput: ExactInQueryOutput | ExactOutQueryOutput
}

export interface BuildSwapInputs extends SwapState {
  account: Address
  slippagePercent: string
  simulateResponse: SimulateSwapResponse
  isNativeAssetIn: boolean
}

export interface SdkBuildSwapInputs extends BuildSwapInputs {
  simulateResponse: SdkSimulateSwapResponse
}

export enum SupportedWrapHandler {
  LIDO = 'LIDO',
}

export const OWrapType = {
  WRAP: 'wrap',
  UNWRAP: 'unwrap',
} as const

export type WrapType = (typeof OWrapType)[keyof typeof OWrapType]

export const OSwapAction = {
  ...OWrapType,
  SWAP: 'swap',
} as const

export type SwapAction = (typeof OSwapAction)[keyof typeof OSwapAction]
