import { getChainId } from '@/lib/config/app.config'
import { SwapHandler } from './Swap.handler'
import { ApolloClient } from '@apollo/client'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import { SdkBuildSwapInputs, SimulateSwapInputs, SimulateSwapResponse } from '../swap.types'
import { WrapType, getWrapType } from '../useWrapping'
import { Address, encodeFunctionData } from 'viem'
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

    // const tx = swap.buildCall({
    //   slippage: Slippage.fromPercentage(slippagePercent as `${number}`),
    //   deadline: BigInt(getTimestampInMinsFromNow(60)),
    //   expectedAmountOut: onchainReturnAmount,
    //   sender: account,
    //   recipient: account,
    //   wethIsEth: isNativeAssetIn,
    // })

    let data: Hex | undefined
    if (wrapType === WrapType.WRAP) {
      data = this.buildWrapCallData()
    } else if (wrapType === WrapType.UNWRAP) {
      data = this.buildUnwrapCallData()
    }

    if (!data) throw new Error('NativeWrapUnwrapHandler could not build data')

    return {
      account,
      chainId: getChainId(chain),
      data,
      value: tx.value,
      to: tx.to,
    }
  }

  private buildWrapCallData() {
    return encodeFunctionData({
      abi: ['function deposit() payable'],
      functionName: 'deposit',
    })
  }

  private buildUnwrapCall(scaledAmount: bigint) {
    return encodeFunctionData({
      abi: ['function withdraw(uint256 wad)'],
      functionName: 'withdraw',
      args: [scaledAmount],
    })
  }
}
