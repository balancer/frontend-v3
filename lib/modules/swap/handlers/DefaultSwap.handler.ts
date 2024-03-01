import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { SwapHandler } from './Swap.handler'
import { GetSorSwapsDocument, GqlSorSwapType } from '@/lib/shared/services/api/generated/graphql'
import { ApolloClient } from '@apollo/client'
import { Path, Slippage, Swap, SwapKind } from '@balancer/sdk'
import { formatUnits } from 'viem'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import { SdkBuildSwapInputs, SdkSimulateSwapResponse, SimulateSwapInputs } from '../swap.types'
import { getTimestampInMinsFromNow } from '@/lib/shared/utils/time'

export class DefaultSwapHandler implements SwapHandler {
  constructor(public apolloClient: ApolloClient<object>) {}

  async simulate({ ...variables }: SimulateSwapInputs): Promise<SdkSimulateSwapResponse> {
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
    console.log({
      swap,
      tokenIn: data.swaps.tokenIn,
      tokenOut: data.swaps.tokenOut,
      paths: data.swaps.paths,
      rpc: networkConfig.rpcUrl,
      chain: getChainId(chain),
      swapKind: this.swapTypeToKind(swapType),
    })

    const onchainReturnAmount = await swap.query(networkConfig.rpcUrl)
    console.log('Swap (onchain)', onchainReturnAmount)

    // Format return amount to human readable
    const returnAmount = formatUnits(onchainReturnAmount.amount, onchainReturnAmount.token.decimals)

    return {
      ...data.swaps,
      returnAmount,
      swap,
      onchainReturnAmount,
    }
  }

  build({
    simulateResponse: { swap, onchainReturnAmount },
    slippagePercent,
    account,
    chain,
  }: SdkBuildSwapInputs): TransactionConfig {
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
