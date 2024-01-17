import { SimulateParams, SwapHandler } from './Swap.handler'
import { SentryError } from '@/lib/shared/utils/errors'
import { GetSorSwapsDocument, GetSorSwapsQuery } from '@/lib/shared/services/api/generated/graphql'

export class DefaultSwapHandler implements SwapHandler {
  async simulateSwap({ apolloClient, ...variables }: SimulateParams): Promise<GetSorSwapsQuery> {
    if (!apolloClient) {
      throw new SentryError('ApolloClient undefined for handler that needs it', {
        context: { extra: { handler: 'DefaultSwapHandler', method: 'simulateSwap' } },
      })
    }

    const { data } = await apolloClient.query({
      query: GetSorSwapsDocument,
      variables: {
        ...variables,
        swapOptions: {
          maxPools: 8,
        },
      },
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    })

    return data
  }
  // buildSwapCallData(inputs: BuildAddLiquidityInput): Promise<TransactionConfig> {
  //   throw new Error('Method not implemented.')
  // }
}
