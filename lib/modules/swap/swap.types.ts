import { GqlChain, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { VaultVersion } from '@/lib/shared/types'
import { Swap, TokenAmount } from '@balancer/sdk'
import { Address } from 'wagmi'

export type SimulateSwapInputs = {
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
  vaultVersion: VaultVersion
}

export interface SdkSimulateSwapResponse extends SimulateSwapResponse {
  swap: Swap
  onchainReturnAmount: TokenAmount
}

export interface BuildSwapInputs {
  account: Address
  chain: GqlChain
  slippagePercent: string
  simulateResponse: SimulateSwapResponse
}

export interface SdkBuildSwapInputs extends BuildSwapInputs {
  simulateResponse: SdkSimulateSwapResponse
}
