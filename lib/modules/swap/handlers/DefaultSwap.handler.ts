import { useLazyQuery } from '@apollo/client'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import { SwapHandler } from './Swap.handler'

export class DefaultSwapHandler implements SwapHandler {
  simulateSwap(humanAmountsIn: HumanAmountIn[]): Promise<QueryAddLiquidityOutput> {
    const [fetchSwapQuery, { loading }] = useLazyQuery(GetSorSwapsDocument, {
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    })
  }
  buildSwapCallData(inputs: BuildAddLiquidityInput): Promise<TransactionConfig> {
    throw new Error('Method not implemented.')
  }
}
