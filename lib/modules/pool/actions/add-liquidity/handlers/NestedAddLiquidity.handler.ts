/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { AddLiquidityNested, AddLiquidityNestedInput, ChainId, Slippage } from '@balancer/sdk'
import { Pool } from '../../../usePool'
import { LiquidityActionHelpers } from '../../LiquidityActionHelpers'
import { HumanAmountIn } from '../../liquidity-types'
import { NestedBuildAddLiquidityInput, NestedQueryAddLiquidityOutput } from '../add-liquidity.types'
import { AddLiquidityHandler } from './AddLiquidity.handler'
import { Address, zeroAddress } from 'viem'

/**
 * NestedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for nested adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class NestedAddLiquidityHandler implements AddLiquidityHandler {
  helpers: LiquidityActionHelpers

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async getPriceImpact(): Promise<number> {
    // nested remove liquidity does not have price impact
    return 0
  }

  public async simulate(
    humanAmountsIn: HumanAmountIn[],
    userAddress?: Address
  ): Promise<NestedQueryAddLiquidityOutput> {
    const addLiquidity = new AddLiquidityNested()

    /*
      The sdk expects a valid userAddress in the nested query signature
      When the user is not connected we pass zeroAddress to query bptOut without buildingCalldata
      When the user is connected we pass the real userAddress that will also be used to buildCallData
      TODO: The sdk team is going to remove userAddress from the nested query signature to simplify this:
      https://github.com/balancer/b-sdk/issues/209
     */
    const userAddressForQuery = userAddress || zeroAddress
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn, userAddressForQuery)

    const sdkQueryOutput = await addLiquidity.query(addLiquidityInput, this.helpers.nestedPoolState)

    return { bptOut: sdkQueryOutput.bptOut, sdkQueryOutput }
  }

  public async buildCallData({
    account,
    slippagePercent,
    queryOutput,
  }: NestedBuildAddLiquidityInput): Promise<TransactionConfig> {
    const addLiquidity = new AddLiquidityNested()

    const { call, to, value } = addLiquidity.buildCall({
      ...queryOutput.sdkQueryOutput,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
      // relayerApprovalSignature: signature, // TODO: use when implementing sign relayer step
    })

    return {
      account,
      chainId: this.helpers.chainId,
      data: call,
      to,
      value,
    }
  }

  /**
   * PRIVATE METHODS
   */
  private constructSdkInput(
    humanAmountsIn: HumanAmountIn[],
    userAddress: Address
  ): AddLiquidityNestedInput {
    const amountsIn = this.helpers.toInputAmounts(humanAmountsIn)

    const nonEmptyAmountsIn = amountsIn.filter(a => a.rawAmount !== 0n)

    return {
      accountAddress: userAddress,
      chainId: this.helpers.chainId as ChainId,
      rpcUrl: getDefaultRpcUrl(this.helpers.chainId),
      amountsIn: nonEmptyAmountsIn,
      useNativeAssetAsWrappedAmountIn: this.helpers.isNativeAssetIn(humanAmountsIn),
    }
  }
}
