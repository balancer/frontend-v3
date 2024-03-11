import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { SwapHandler } from './Swap.handler'
import { ApolloClient } from '@apollo/client'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import { SdkBuildSwapInputs, SimulateSwapInputs, SimulateSwapResponse } from '../swap.types'
import { WrapType, getWrapType } from '../useWrapping'
import { createPublicClient, encodeFunctionData, formatUnits, http } from 'viem'
import { Hex } from 'viem'
import { bn } from '@/lib/shared/utils/numbers'
import { mainnet } from 'viem/chains'

export class LidoWrapHandler implements SwapHandler {
  constructor(public apolloClient: ApolloClient<object>) {}

  async simulate({ ...variables }: SimulateSwapInputs): Promise<SimulateSwapResponse> {
    const wrapType = getWrapType(variables.tokenIn, variables.tokenOut, variables.chain)
    if (!wrapType) throw new Error('LidoWrapHandler called with non valid wrap tokens')

    const returnAmount = await this.applyRate(variables.swapAmount, wrapType)

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
    if (!wrapType) throw new Error('NativeWrapHandler called with non valid wrap tokens')

    const { tokens } = getNetworkConfig(selectedChain)

    let data: Hex | undefined
    if (wrapType === WrapType.WRAP) {
      data = this.buildWrapCallData()
    } else if (wrapType === WrapType.UNWRAP) {
      data = this.buildUnwrapCallData(tokenIn.scaledAmount)
    }

    if (!data) throw new Error('NativeWrapHandler could not build data')

    const value = wrapType === WrapType.WRAP ? tokenIn.scaledAmount : BigInt(0)

    return {
      account,
      chainId: getChainId(selectedChain),
      data,
      value,
      to: tokens.addresses.wNativeAsset,
    }
  }

  private buildWrapCallData() {
    return encodeFunctionData({
      abi: [
        {
          inputs: [],
          name: 'deposit',
          outputs: [],
          stateMutability: 'payable',
          type: 'function',
        },
      ],
      functionName: 'deposit',
    })
  }

  private buildUnwrapCallData(scaledAmount: bigint) {
    return encodeFunctionData({
      abi: [
        {
          inputs: [{ name: 'amount', type: 'uint256' }],
          name: 'withdraw',
          outputs: [],
          stateMutability: '',
          type: 'function',
        },
      ],
      functionName: 'withdraw',
      args: [scaledAmount],
    })
  }

  private async applyRate(amount: string, wrapType: WrapType | null) {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(),
    })

    const rateScaled = await publicClient.readContract({
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
