import {
  GetSorSwapsQuery,
  GqlChain,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import { Swap, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

export type SimulateSwapInputs = {
  chain: GqlChain
  tokenIn: Address
  tokenOut: Address
  swapType: GqlSorSwapType
  swapAmount: string
}

export type SimulateSwapResponse = GetSorSwapsQuery['swaps']

export interface SdkSimulateSwapResponse extends SimulateSwapResponse {
  swap: Swap
  onchainReturnAmount: TokenAmount
}

export interface BuildSwapInputs {
  account: Address
  chain: GqlChain
  slippagePercent: string
  simulateResponse: SimulateSwapResponse
  isNativeAssetIn: boolean
}

export interface SdkBuildSwapInputs extends BuildSwapInputs {
  simulateResponse: SdkSimulateSwapResponse
}
