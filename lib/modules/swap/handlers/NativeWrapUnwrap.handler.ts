import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { SwapHandler } from './Swap.handler'
import { ApolloClient } from '@apollo/client'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import { SdkBuildSwapInputs, SimulateSwapInputs, SimulateSwapResponse } from '../swap.types'
import { WrapType, getWrapType } from '../useWrapping'
import { encodeFunctionData } from 'viem'
import { Hex } from 'viem'

export class NativeWrapUnwrapHandler implements SwapHandler {
  constructor(public apolloClient: ApolloClient<object>) {}

  async simulate({ ...variables }: SimulateSwapInputs): Promise<SimulateSwapResponse> {
    return {
      swapType: variables.swapType,
      priceImpact: '0',
      effectivePrice: '1',
      effectivePriceReversed: '1',
      returnAmount: variables.swapAmount,
    }
  }

  build({ tokenIn, tokenOut, account, chain }: SdkBuildSwapInputs): TransactionConfig {
    const wrapType = getWrapType(tokenIn.address, tokenOut.address, chain)
    if (!wrapType) throw new Error('NativeWrapUnwrapHandler called with non valid wrap tokens')

    const { tokens } = getNetworkConfig(chain)

    let data: Hex | undefined
    if (wrapType === WrapType.WRAP) {
      data = this.buildWrapCallData()
    } else if (wrapType === WrapType.UNWRAP) {
      data = this.buildUnwrapCallData(tokenIn.scaledAmount)
    }

    if (!data) throw new Error('NativeWrapUnwrapHandler could not build data')

    const value = wrapType === WrapType.WRAP ? tokenIn.scaledAmount : BigInt(0)

    return {
      account,
      chainId: getChainId(chain),
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
}
