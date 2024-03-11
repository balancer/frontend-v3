import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { SwapHandler } from './Swap.handler'
import { ApolloClient } from '@apollo/client'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import { SdkBuildSwapInputs, SimulateSwapInputs, SimulateSwapResponse } from '../swap.types'
import { WrapType, getWrapType } from '../useWrapping'
import { encodeFunctionData, formatUnits } from 'viem'
import { Hex } from 'viem'
import { bn } from '@/lib/shared/utils/numbers'
import { getViemClient } from '@/lib/shared/services/viem/viem.client'
import { GqlChain } from '@/lib/shared/services/api/generated/graphql'

export class LidoWrapHandler implements SwapHandler {
  constructor(public apolloClient: ApolloClient<object>) {}

  async simulate({ ...variables }: SimulateSwapInputs): Promise<SimulateSwapResponse> {
    const wrapType = getWrapType(variables.tokenIn, variables.tokenOut, variables.chain)
    if (!wrapType) throw new Error('LidoWrapHandler called with non valid wrap tokens')

    const returnAmount = await this.applyRate(variables.swapAmount, wrapType, variables.chain)

    return {
      swapType: variables.swapType,
      priceImpact: '0',
      effectivePrice: '1',
      effectivePriceReversed: '1',
      returnAmount,
    }
  }

  build({ tokenIn, tokenOut, account, selectedChain }: SdkBuildSwapInputs): TransactionConfig {
    const wrapType = getWrapType(tokenIn.address, tokenOut.address, selectedChain)
    if (!wrapType) throw new Error('Non valid wrap tokens')

    const { tokens } = getNetworkConfig(selectedChain)

    let data: Hex | undefined
    if (wrapType === WrapType.WRAP) {
      data = this.buildWrapCallData()
    } else if (wrapType === WrapType.UNWRAP) {
      data = this.buildUnwrapCallData(tokenIn.scaledAmount)
    }

    if (!data) throw new Error('Could not build data')

    return {
      account,
      chainId: getChainId(selectedChain),
      data,
      to: tokens.addresses.wNativeAsset,
    }
  }

  private buildWrapCallData() {
    return encodeFunctionData({
      abi: [
        {
          inputs: [{ name: '_stETHAmount', type: 'uint256' }],
          name: 'wrap',
          outputs: [{ name: 'amount', type: 'uint256' }],
          stateMutability: '',
          type: 'function',
        },
      ],
      functionName: 'wrap',
    })
  }

  private buildUnwrapCallData(scaledAmount: bigint) {
    return encodeFunctionData({
      abi: [
        {
          inputs: [{ name: 'amount', type: 'uint256' }],
          name: 'withdraw',
          outputs: [{ name: 'amount', type: 'uint256' }],
          stateMutability: '',
          type: 'function',
        },
      ],
      functionName: 'withdraw',
      args: [scaledAmount],
    })
  }

  private async applyRate(amount: string, wrapType: WrapType | null, chain: GqlChain) {
    const viemClient = getViemClient(chain)

    const rateScaled = await viemClient.readContract({
      abi: [
        {
          inputs: [],
          name: 'getRate',
          outputs: [{ name: 'amount', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      address: '0x72d07d7dca67b8a406ad1ec34ce969c90bfee768',
      functionName: 'getRate',
    })

    const rate = formatUnits(rateScaled, 18)

    return wrapType === WrapType.WRAP
      ? bn(amount).times(rate).div(1).toString()
      : bn(amount).times(1).div(rate).toString()
  }
}
