import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import {
  HumanAmount,
  RemoveLiquidityNested,
  RemoveLiquidityNestedProportionalInput,
  RemoveLiquidityNestedQueryOutput,
  Slippage,
} from '@balancer/sdk'
import { Address, parseEther, zeroAddress } from 'viem'
import { Pool } from '../../../usePool'
import { LiquidityActionHelpers } from '../../LiquidityActionHelpers'
import {
  BuildRemoveLiquidityInput,
  QueryRemoveLiquidityInput,
  QueryRemoveLiquidityOutput,
} from '../remove-liquidity.types'
import { RemoveLiquidityHandler } from './RemoveLiquidity.handler'

export interface NestedProportionalQueryRemoveLiquidityOutput extends QueryRemoveLiquidityOutput {
  sdkQueryOutput: RemoveLiquidityNestedQueryOutput
}

export interface NestedProportionalQueryRemoveLiquidityInput extends BuildRemoveLiquidityInput {
  queryOutput: NestedProportionalQueryRemoveLiquidityOutput
}

export class NestedProportionalRemoveLiquidityHandler implements RemoveLiquidityHandler {
  helpers: LiquidityActionHelpers

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async simulate({
    humanBptIn,
    userAddress,
  }: QueryRemoveLiquidityInput): Promise<NestedProportionalQueryRemoveLiquidityOutput> {
    const removeLiquidity = new RemoveLiquidityNested()

    /*
      The sdk expects a valid userAddress in the nested query signature
      When the user is not connected we pass zeroAddress to query bptOut without buildingCalldata
      When the user is connected we pass the real userAddress that will also be used to buildCallData
      TODO: The sdk team is going to remove userAddress from the nested query signature to simplify this:
      https://github.com/balancer/b-sdk/issues/209
     */
    const userAddressForQuery = userAddress || zeroAddress

    const removeLiquidityInput = this.constructSdkInput(humanBptIn, userAddressForQuery)

    const sdkQueryOutput = await removeLiquidity.query(
      removeLiquidityInput,
      this.helpers.nestedPoolState
    )

    return { amountsOut: sdkQueryOutput.amountsOut, sdkQueryOutput }
  }

  public async getPriceImpact(): Promise<number> {
    // proportional remove liquidity does not have price impact
    return 0
  }

  public async buildCallData({
    account,
    slippagePercent,
    queryOutput,
    relayerApprovalSignature,
  }: NestedProportionalQueryRemoveLiquidityInput): Promise<TransactionConfig> {
    const removeLiquidity = new RemoveLiquidityNested()

    const { call, to } = removeLiquidity.buildCall({
      ...queryOutput.sdkQueryOutput,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
      relayerApprovalSignature,
    })

    return {
      account,
      chainId: this.helpers.chainId,
      data: call,
      to,
    }
  }

  /**
   * PRIVATE METHODS
   */
  private constructSdkInput(
    humanBptIn: HumanAmount,
    userAddress: Address
  ): RemoveLiquidityNestedProportionalInput {
    const result: RemoveLiquidityNestedProportionalInput = {
      accountAddress: userAddress,
      bptAmountIn: parseEther(humanBptIn),
      // Ignore TS error until base chain is added to the SDK setup:
      // https://github.com/balancer/b-sdk/issues/221
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chainId: this.helpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.helpers.chainId),
      useNativeAssetAsWrappedAmountOut: false, // assuming we don't want to withdraw the native asset over the wrapped native asset for now.
    }

    return result
  }
}
