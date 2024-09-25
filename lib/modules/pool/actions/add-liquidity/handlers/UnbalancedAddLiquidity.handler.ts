/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HumanTokenAmountWithAddress } from '@/lib/modules/tokens/token.types'
import { TransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { getRpcUrl } from '@/lib/modules/web3/transports'
import {
  AddLiquidity,
  AddLiquidityBaseBuildCallInput,
  AddLiquidityBaseQueryOutput,
  AddLiquidityKind,
  AddLiquidityUnbalancedInput,
  Permit2,
  Permit2Helper,
  PriceImpact,
  PriceImpactAmount,
  PublicWalletClient,
  Slippage,
} from '@balancer/sdk'
import { Pool } from '../../../PoolProvider'
import {
  LiquidityActionHelpers,
  areEmptyAmounts,
  formatBuildCallParams,
} from '../../LiquidityActionHelpers'
import { SdkBuildAddLiquidityInput, SdkQueryAddLiquidityOutput } from '../add-liquidity.types'
import { AddLiquidityHandler, Permit2AddLiquidityInput } from './AddLiquidity.handler'
import { NoncesByTokenAddress } from '@/lib/modules/tokens/approvals/permit2/usePermit2Nonces'

/**
 * UnbalancedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class UnbalancedAddLiquidityHandler implements AddLiquidityHandler {
  helpers: LiquidityActionHelpers

  constructor(pool: Pool) {
    this.helpers = new LiquidityActionHelpers(pool)
  }

  public async simulate(
    humanAmountsIn: HumanTokenAmountWithAddress[]
  ): Promise<SdkQueryAddLiquidityOutput> {
    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const sdkQueryOutput = await addLiquidity.query(addLiquidityInput, this.helpers.poolState)

    return { bptOut: sdkQueryOutput.bptOut, sdkQueryOutput }
  }

  public async getPriceImpact(humanAmountsIn: HumanTokenAmountWithAddress[]): Promise<number> {
    if (areEmptyAmounts(humanAmountsIn)) {
      // Avoid price impact calculation when there are no amounts in
      return 0
    }

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalanced(
      addLiquidityInput,
      this.helpers.poolState
    )

    return priceImpactABA.decimal
  }

  public async buildCallData({
    slippagePercent,
    queryOutput,
    account,
    permit2,
  }: SdkBuildAddLiquidityInput): Promise<TransactionConfig> {
    const addLiquidity = new AddLiquidity()

    const buildCallParams = formatBuildCallParams(
      this.constructBaseBuildCallInput({
        sdkQueryOutput: queryOutput.sdkQueryOutput,
        slippagePercent: slippagePercent,
      }),
      this.helpers.isV3Pool(),
      account
    )

    if (this.helpers.isV3Pool() && !permit2) {
      throw new Error('Permit2 signature is required for V3 pools')
    }

    const { callData, to, value } =
      this.helpers.isV3Pool() && permit2
        ? addLiquidity.buildCallWithPermit2(buildCallParams, permit2)
        : addLiquidity.buildCall(buildCallParams)

    return {
      account,
      chainId: this.helpers.chainId,
      data: callData,
      to,
      value,
    }
  }

  public async signPermit2(
    input: Permit2AddLiquidityInput,
    sdkClient: PublicWalletClient,
    nonces: NoncesByTokenAddress
  ): Promise<Permit2> {
    const baseInput = this.constructBaseBuildCallInput({
      slippagePercent: input.slippagePercent,
      sdkQueryOutput: input.sdkQueryOutput as AddLiquidityBaseQueryOutput,
    })
    const signature = await Permit2Helper.signAddLiquidityApproval({
      ...baseInput,
      client: sdkClient,
      owner: input.account,
      nonces: baseInput.amountsIn.map(a => nonces[a.token.address]),
    })
    return signature
  }

  /**
   * PRIVATE METHODS
   */
  private constructSdkInput(
    humanAmountsIn: HumanTokenAmountWithAddress[]
  ): AddLiquidityUnbalancedInput {
    const amountsIn = this.helpers.toSdkInputAmounts(humanAmountsIn)

    return {
      chainId: this.helpers.chainId,
      rpcUrl: getRpcUrl(this.helpers.chainId),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
    }
  }

  public constructBaseBuildCallInput({
    slippagePercent,
    sdkQueryOutput,
  }: {
    slippagePercent: string
    sdkQueryOutput: AddLiquidityBaseQueryOutput
  }): AddLiquidityBaseBuildCallInput {
    const baseBuildCallParams = {
      ...(sdkQueryOutput as AddLiquidityBaseQueryOutput),
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      wethIsEth: this.helpers.includesNativeAsset(sdkQueryOutput.amountsIn),
    }
    // baseBuildCallParams.amountsIn = baseBuildCallParams.amountsIn.filter(
    //   amountIn => amountIn.amount > 0n
    // )
    return baseBuildCallParams
  }
}
