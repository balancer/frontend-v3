import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { SwapHandler } from './Swap.handler'
import { GetSorSwapsDocument, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { ApolloClient } from '@apollo/client'
import { Path, Slippage, Swap, SwapKind } from '@balancer/sdk'
import { formatUnits } from 'viem'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import { SdkBuildSwapCallDataInput, SdkSimulateSwapResponse, SwapInputs } from '../swap.types'
import { getTimestampInMinsFromNow } from '@/lib/shared/utils/time'

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

  buildSwapCallData({
    simulateResponse: { swap, onchainReturnAmount },
    slippagePercent,
    account,
    chain,
  }: SdkBuildSwapCallDataInput): TransactionConfig {
    const tx = swap.buildCall({
      slippage: Slippage.fromPercentage(slippagePercent as `${number}`),
      deadline: BigInt(getTimestampInMinsFromNow(60)),
      expectedAmountOut: onchainReturnAmount,
      sender: account,
      recipient: account,
      wethIsEth: false,
    })

    return {
      account,
      chainId: getChainId(chain),
      data: tx.callData,
      value: tx.value,
      to: tx.to,
    }
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
