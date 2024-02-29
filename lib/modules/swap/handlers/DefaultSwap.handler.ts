import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import {
  SwapInputs,
  SimulateSwapResponse,
  SwapHandler,
  SdkSimulateSwapResponse,
  SdkBuildSwapCallDataInput,
} from './Swap.handler'
import {
  GetSorSwapsDocument,
  GetSorSwapsQuery,
  GqlSorSwapType,
} from '@/lib/shared/services/api/generated/graphql'
import { ApolloClient } from '@apollo/client'
import { Path, Swap, SwapKind } from '@balancer/sdk'
import { formatUnits } from 'viem'
import { TransactionConfig } from '../../web3/contracts/contract.types'

export class DefaultSwapHandler implements SwapHandler {
  constructor(public apolloClient: ApolloClient<object>) {}

  async simulate({ ...variables }: SwapInputs): Promise<SdkSimulateSwapResponse> {
    console.log('Fetching swap simulation', variables)
    const { chain, swapType } = variables
    const networkConfig = getNetworkConfig(variables.chain)

    const { data } = await this.apolloClient.query({
      query: GetSorSwapsDocument,
      variables,
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
    })
    console.log('Swap (API)', data.swaps)

    const swap = new Swap({
      chainId: getChainId(chain),
      paths: data.swaps.paths as unknown as Path[],
      swapKind: this.swapTypeToKind(swapType),
    })

    // Get return amount with onchain call
    const onchainReturnAmount = await swap.query(networkConfig.rpcUrl)
    console.log('Swap (onchain)', onchainReturnAmount)

    // Format return amount to human readable
    const returnAmount = formatUnits(onchainReturnAmount.amount, onchainReturnAmount.token.decimals)

    return {
      returnAmount,
      swapType: data.swaps.swapType,
      priceImpact: data.swaps.priceImpact,
      effectivePrice: data.swaps.effectivePrice,
      effectivePriceReversed: data.swaps.effectivePriceReversed,
      swap: swap,
      onchainReturnAmount,
    }
  }

  buildSwapCallData(inputs: SdkBuildSwapCallDataInput): Promise<TransactionConfig> {
    const {
      simulateResponse: { swap, onchainReturnAmount },
      slippage,
    } = inputs

    const callData = swap.buildCall({
      slippage,
      deadline,
      expectedAmountOut: onchainReturnAmount,
      sender,
      recipient,
      wethIsEth: false,
    }) as SwapBuildOutputExactIn
  }

  private swapTypeToKind(swapType: GqlSorSwapType): SwapKind {
    switch (swapType) {
      case GqlSorSwapType.ExactIn:
        return SwapKind.GivenIn
      case GqlSorSwapType.ExactOut:
        return SwapKind.GivenOut
      default:
        throw new Error('Invalid swap type')
    }
  }
}
