import { GqlChain, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { ApolloClient } from '@apollo/client'
import { Address } from 'viem'

export type SimulateParams = {
  chain: GqlChain
  tokenIn: Address
  tokenOut: Address
  swapType: GqlSorSwapType
  swapAmount: string
  apolloClient?: ApolloClient<object>
}

/**
 * SwapHandler is an interface that defines the methods that must be implemented by a handler.
 * They take standard inputs from the UI and return frontend standardised outputs.
 */
export interface SwapHandler {
  simulateSwap(params: SimulateParams): Promise<any>
  // buildSwapCallData(inputs: BuildAddLiquidityInput): Promise<TransactionConfig>
}
