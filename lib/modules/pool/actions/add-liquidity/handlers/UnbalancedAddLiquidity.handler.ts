import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityUnbalancedInput,
  InputAmount,
  PriceImpact,
  Slippage,
} from '@balancer/sdk'
import { AddLiquidityService } from '../AddLiquidityService'
import { AddLiquidityHandler } from './AddLiquidity.handler'
import {
  AddLiquidityInputs,
  AddLiquidityOutputs,
  HumanAmountIn,
  PriceImpactAmount,
} from '../add-liquidity.types'
import { keyBy } from 'lodash'
import { parseUnits } from 'viem'
import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import { areEmptyAmounts } from '../add-liquidity.helpers'
import { SdkTransactionConfig } from '@/lib/modules/web3/contracts/contract.types'

/**
 * UnbalancedAddLiquidityHandler is a handler that implements the
 * AddLiquidityHandler interface for unbalanced adds, e.g. where the user
 * specifies the token amounts in. It uses the Balancer SDK to implement it's
 * methods. It also handles the case where one of the input tokens is the native
 * asset instead of the wrapped native asset.
 */
export class UnbalancedAddLiquidityHandler implements AddLiquidityHandler {
  constructor(public readonly service: AddLiquidityService) {}

  async queryAddLiquidity({ humanAmountsIn }: AddLiquidityInputs): Promise<AddLiquidityOutputs> {
    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const { bptOut } = await addLiquidity.query(addLiquidityInput, this.service.poolStateInput)
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
      this.service.poolStateInput
    )

    return priceImpactABA.decimal
  }

  async buildAddLiqudityTx({
    humanAmountsIn,
    account,
    slippagePercent,
  }: AddLiquidityInputs): Promise<SdkTransactionConfig> {
    if (!account || !slippagePercent) throw new Error('Missing account or slippage')

    const addLiquidity = new AddLiquidity()
    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    // TODO: we probably don't need this query when building the call as we already used it (check queryAddLiquidity) during the Add Liquidity form management
    const queryResult = await addLiquidity.query(addLiquidityInput, this.service.poolStateInput)

    const { call, to, value } = addLiquidity.buildCall({
      ...queryResult,
      slippage: Slippage.fromPercentage(`${Number(slippagePercent)}`),
      sender: account,
      recipient: account,
    })

    const config: SdkTransactionConfig = {
      account,
      chainId: this.service.chainId,
      data: call,
      to,
      value,
    }

    return config
  }

  /**
   * PRIVATE METHODS
   */
  private isNativeAssetIn(humanAmountsIn: HumanAmountIn[]): boolean {
    const nativeAssetAddress = this.service.networkConfig.tokens.nativeAsset.address

    return humanAmountsIn.some(amountIn => isSameAddress(amountIn.tokenAddress, nativeAssetAddress))
  }

  private constructSdkInput(humanAmountsIn: HumanAmountIn[]): AddLiquidityUnbalancedInput {
    const amountsInList: InputAmount[] = this.service.poolStateInput?.tokens.map(t => {
      return {
        rawAmount: 0n,
        decimals: t.decimals,
        address: t.address,
      }
    })

    const amountsInByTokenAddress = keyBy(amountsInList, a => a.address)

    // from humanAmountsIn to SDK AmountsIn
    humanAmountsIn.forEach(({ tokenAddress, humanAmount }) => {
      if (!amountsInByTokenAddress[tokenAddress]) {
        throw new Error(`Provided token address ${tokenAddress} not found in pool tokens`)
      }
      const decimals = amountsInByTokenAddress[tokenAddress].decimals
      amountsInByTokenAddress[tokenAddress].rawAmount = parseUnits(humanAmount, decimals)
    })

    const amountsIn = Object.values(amountsInByTokenAddress)

    return {
      chainId: this.service.chainId,
      rpcUrl: getDefaultRpcUrl(this.service.chainId),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn: this.isNativeAssetIn(humanAmountsIn),
    }
  }
}
