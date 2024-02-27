import { SwapInputs, SimulateSwapResponse, SwapHandler } from './Swap.handler'
import { GetSorSwapsDocument, GetSorSwapsQuery } from '@/lib/shared/services/api/generated/graphql'
import { ApolloClient } from '@apollo/client'

export class DefaultSwapHandler implements SwapHandler {
  constructor(public apolloClient: ApolloClient<object>) {}

  async simulate({ ...variables }: SwapInputs): Promise<SimulateSwapResponse> {
    console.log('Fetching swap simulation', variables)

    const { data } = await this.apolloClient.query({
      query: GetSorSwapsDocument,
      variables,
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    })

    console.log('Swap response', data)

    return {
      returnAmount: data.swaps.returnAmount,
      swapType: data.swaps.swapType,
      priceImpact: data.swaps.priceImpact,
      effectivePrice: data.swaps.effectivePrice,
      effectivePriceReversed: data.swaps.effectivePriceReversed,
      sorSwapsQuery: data as GetSorSwapsQuery,
    }
  }
  // buildSwapCallData(inputs: BuildAddLiquidityInput): Promise<TransactionConfig> {
  //   throw new Error('Method not implemented.')
  // }
}
