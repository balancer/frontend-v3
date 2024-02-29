import { GqlChain, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { Swap, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

export type SwapInputs = {
  chain: GqlChain
  tokenIn: Address
  tokenOut: Address
  swapType: GqlSorSwapType
  swapAmount: string
}

export interface SimulateSwapResponse {
  returnAmount: string
  swapType: GqlSorSwapType
  priceImpact: string
  effectivePrice: string
  effectivePriceReversed: string
}

export interface SdkSimulateSwapResponse extends SimulateSwapResponse {
  swap: Swap
  onchainReturnAmount: TokenAmount
}

export interface BuildSwapCallDataInput {
  account: Address
  chain: GqlChain
  slippagePercent: string
  simulateResponse: SimulateSwapResponse
}

export interface SdkBuildSwapCallDataInput extends BuildSwapCallDataInput {
  simulateResponse: SdkSimulateSwapResponse
}
