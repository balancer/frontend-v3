import {
  GetSorSwapsQuery,
  GqlChain,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import { ApolloClient } from '@apollo/client'
import { Address } from 'viem'

export type SwapInputs = {
  chain: GqlChain
  tokenIn: Address
  tokenOut: Address
  swapType: GqlSorSwapType
  swapAmount: string
}

export type SimulateSwapResponse = {
  returnAmount: string
  swapType: GqlSorSwapType
  priceImpact: string
  effectivePrice: string
  effectivePriceReversed: string
  sorSwapsQuery?: GetSorSwapsQuery
}

/**
 * SwapHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 */
export interface SwapHandler {
  apolloClient?: ApolloClient<object>

  simulate(params: SwapInputs): Promise<SimulateSwapResponse>
  // buildSwapCallData(inputs: BuildAddLiquidityInput): Promise<TransactionConfig>
}
