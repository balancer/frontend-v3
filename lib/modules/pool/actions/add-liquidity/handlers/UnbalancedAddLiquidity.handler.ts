import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityUnbalancedInput,
  PriceImpact,
  Slippage,
} from '@balancer/sdk'
import { AddLiquidityHelpers } from '../AddLiquidityHelpers'
import { areEmptyAmounts } from '../add-liquidity.helpers'
import {
  AddLiquidityInputs,
  AddLiquidityOutputs,
  HumanAmountIn,
  PriceImpactAmount,
} from '../add-liquidity.types'
import { AddLiquidityHandler } from './AddLiquidity.handler'

/**
 * UnbalancedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class UnbalancedAddLiquidityHandler implements AddLiquidityHandler {
  constructor(private addLiquidityHelpers: AddLiquidityHelpers) {}

  public async queryAddLiquidity({
    humanAmountsIn,
  }: AddLiquidityInputs): Promise<AddLiquidityOutputs> {
    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const { bptOut } = await addLiquidity.query(
      addLiquidityInput,
      this.addLiquidityHelpers.poolStateInput
    )
    return { bptOut }
  }

  public async calculatePriceImpact({ humanAmountsIn }: AddLiquidityInputs): Promise<number> {
    if (areEmptyAmounts(humanAmountsIn)) {
      // Avoid price impact calculation when there are no amounts in
      return 0
    }

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
      addLiquidityInput,
      this.addLiquidityHelpers.poolStateInput
    )

    return priceImpactABA.decimal
  }

  public async buildAddLiquidityTx({
    humanAmountsIn,
    account,
    slippagePercent,
  }: AddLiquidityInputs): Promise<TransactionConfig> {
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')

    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    // TODO: we probably don't need this query when building the call as we already used it (check queryAddLiquidity) during the Add Liquidity form management
    const queryResult = await addLiquidity.query(
      addLiquidityInput,
      this.addLiquidityHelpers.poolStateInput
    )

    const { call, to, value } = addLiquidity.buildCall({
      ...queryResult,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
    })

    return {
      account,
      chainId: this.addLiquidityHelpers.chainId,
      data: call,
      to,
      value,
    }
  }

  /**
   * PRIVATE METHODS
   */
  private isNativeAssetIn(humanAmountsIn: HumanAmountIn[]): boolean {
    const nativeAssetAddress = this.addLiquidityHelpers.networkConfig.tokens.nativeAsset.address

    return humanAmountsIn.some(amountIn => isSameAddress(amountIn.tokenAddress, nativeAssetAddress))
  }

  private constructSdkInput(humanAmountsIn: HumanAmountIn[]): AddLiquidityUnbalancedInput {
    const amountsIn = this.addLiquidityHelpers.toInputAmounts(humanAmountsIn)

    return {
      chainId: this.addLiquidityHelpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.addLiquidityHelpers.chainId),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn: this.isNativeAssetIn(humanAmountsIn),
    }
  }
}
