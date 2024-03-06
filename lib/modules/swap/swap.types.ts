import {
  GetSorSwapsQuery,
  GqlChain,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import { Swap, TokenAmount } from '@balancer/sdk'
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
  onchainReturnAmount: TokenAmount
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
