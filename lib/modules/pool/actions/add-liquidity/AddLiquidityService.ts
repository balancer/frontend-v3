import { SupportedChainId } from '@/lib/config/config.types'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { PoolStateInput, Slippage } from '@balancer/sdk'
import { Address } from 'wagmi'
import { AddLiquidityInputs, AddLiquidityOutputs } from './add-liquidity.types'
import { AddLiquidityHandler } from './handlers/AddLiquidity.handler'
import { UnbalancedAddLiquidityHandler } from './handlers/UnbalancedAddLiquidity.handler'
import { getNetworkConfig } from '@/lib/config/app.config'

// TODO: this should be imported from the SDK
export type InputAmount = {
  address: Address
  decimals: number
  rawAmount: bigint
}

type AddLiquidityType = 'unbalanced' | 'nested'

// Null object used to avoid conditional checks during hook loading state
const NullPoolState: PoolStateInput = {
  id: nullAddress,
  address: nullAddress,
  type: 'Null',
  tokens: [],
}

/*
  AddLiquidityService provides a fixed interface to add liquidity handlers.
*/
export class AddLiquidityService {
  handler: AddLiquidityHandler
  slippage: Slippage = Slippage.fromPercentage('1')

  constructor(
    public readonly chainId: SupportedChainId,
    public poolStateInput: PoolStateInput = NullPoolState,
    public addLiquidityType: AddLiquidityType = 'unbalanced'
  ) {
    this.handler = this.setHandler(addLiquidityType)
  }

  public get networkConfig() {
    return getNetworkConfig(this.chainId)
  }

  setHandler(addLiquidityType: AddLiquidityType) {
    switch (addLiquidityType) {
      case 'unbalanced':
        return new UnbalancedAddLiquidityHandler(this)
      default:
        return new UnbalancedAddLiquidityHandler(this)
    }
  }

  queryAddLiquidity(inputs: AddLiquidityInputs): Promise<AddLiquidityOutputs> {
    return this.handler.queryAddLiquidity(inputs)
  }

  calculatePriceImpact(inputs: AddLiquidityInputs): Promise<number> {
    return this.handler.calculatePriceImpact(inputs)
  }

  buildAddLiqudityTx(inputs: AddLiquidityInputs): Promise<any> {
    return this.handler.buildAddLiqudityTx(inputs)
  }
}
