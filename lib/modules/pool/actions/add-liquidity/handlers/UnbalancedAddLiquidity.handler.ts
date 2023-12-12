import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityUnbalancedInput,
  InputAmount,
  PriceImpact,
  Slippage,
} from '@balancer/sdk'
import { AddLiquidityHelpers } from '../AddLiquidityHelpers'
import { AddLiquidityHandler } from './AddLiquidity.handler'
import {
  AddLiquidityInputs,
  AddLiquidityOutputs,
  HumanAmountIn,
  PriceImpactAmount,
} from '../add-liquidity.types'
import { keyBy } from 'lodash'
import { Address, parseUnits } from 'viem'
import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { areEmptyAmounts } from '../add-liquidity.helpers'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { HumanAmountInWithTokenInfo } from '../AddLiquidityFlowButton'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'

/**
 * UnbalancedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class UnbalancedAddLiquidityHandler implements AddLiquidityHandler {
  constructor(public readonly helpers: AddLiquidityHelpers) {}

  async queryAddLiquidity({ humanAmountsIn }: AddLiquidityInputs): Promise<AddLiquidityOutputs> {
    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const { bptOut } = await addLiquidity.query(addLiquidityInput, this.helpers.poolStateInput)
    return { bptOut }
  }

  async calculatePriceImpact({ humanAmountsIn }: AddLiquidityInputs): Promise<number> {
    if (areEmptyAmounts(humanAmountsIn)) {
      // Avoid price impact calculation when there are no amounts in
      return 0
    }

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
      addLiquidityInput,
      this.helpers.poolStateInput
    )

    return priceImpactABA.decimal
  }

  async buildAddLiquidityTx({
    humanAmountsIn,
    account,
    slippagePercent,
  }: AddLiquidityInputs): Promise<TransactionConfig> {
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')

    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    // TODO: we probably don't need this query when building the call as we already used it (check queryAddLiquidity) during the Add Liquidity form management
    const queryResult = await addLiquidity.query(addLiquidityInput, this.helpers.poolStateInput)

    const { call, to, value } = addLiquidity.buildCall({
      ...queryResult,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
    })

    return {
      account,
      chainId: this.helpers.chainId,
      data: call,
      to,
      value,
    }
  }

  //TODO: move to common place (abstract??)
  public get queryKey(): string {
    // REVIEW THIS
    // const { amountsIn } = this.getJoinInput()
    // return `${this.service.chainId}:${this.slippage}${JSON.stringify(this.service.poolStateInput)}`
    return `${this.helpers.chainId}:${JSON.stringify(this.helpers.poolStateInput)}`
  }

  // TODO: already implemented in abstract parent
  public get poolTokenAddresses(): Address[] {
    return this.helpers.poolStateInput.tokens.map(t => t.address)
  }

  /**
   * PRIVATE METHODS
   */
  private isNativeAssetIn(humanAmountsIn: HumanAmountIn[]): boolean {
    const nativeAssetAddress = this.helpers.networkConfig.tokens.nativeAsset.address

    return humanAmountsIn.some(amountIn => isSameAddress(amountIn.tokenAddress, nativeAssetAddress))
  }

  private constructSdkInput(humanAmountsIn: HumanAmountIn[]): AddLiquidityUnbalancedInput {
    const amountsIn = this.helpers.toInputAmounts(humanAmountsIn)

    return {
      chainId: this.helpers.chainId,
      rpcUrl: getDefaultRpcUrl(this.helpers.chainId),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn: this.isNativeAssetIn(humanAmountsIn),
    }
  }
}
