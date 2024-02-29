import {
  GetSorSwapsQuery,
  GqlChain,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import { ApolloClient } from '@apollo/client'
import { Swap, TokenAmount } from '@balancer/sdk'
import { Address } from 'viem'
import { TransactionConfig } from '../../web3/contracts/contract.types'

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
  slippagePercent: string
  simulateResponse: SimulateSwapResponse
}

export interface SdkBuildSwapCallDataInput extends BuildSwapCallDataInput {
  simulateResponse: SdkSimulateSwapResponse
}

/**
 * SwapHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 */
export interface SwapHandler {
  apolloClient?: ApolloClient<object>

  simulate(params: SwapInputs): Promise<SimulateSwapResponse>
  buildSwapCallData(inputs: BuildSwapCallDataInput): Promise<TransactionConfig>
}
