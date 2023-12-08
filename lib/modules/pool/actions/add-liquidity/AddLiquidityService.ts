import { SupportedChainId } from '@/lib/config/config.types'
import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { SdkTransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquidityUnbalancedInput,
  HumanAmount,
  PoolStateInput,
  Slippage,
} from '@balancer/sdk'
import { keyBy } from 'lodash'
import { parseUnits } from 'viem'
import { Address } from 'wagmi'
import { HumanAmountIn } from './add-liquidity.types'

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
  Class to build AddLiquidity configs with balancer SDK
  Those configs are passed to useManagedSendTransaction hook to send the an AddLiquidity transaction

  Usage:
  - Create an instance of AddLiquidityService
  - Setup the AddLiquidity state with methods like this.setAmountsIn()
  - Generate the final AddLiquidity config with this.buildSdkAddLiquidityTxConfig()
*/
export class AddLiquidityService {
  slippage: Slippage = Slippage.fromPercentage('1')

  constructor(
    private chainId: SupportedChainId,
    public poolStateInput: PoolStateInput = NullPoolState,
    public addLiquidityType: AddLiquidityType = 'unbalanced'
  ) {}

  public get queryKey() {
    // REVIEW THIS
    // const { amountsIn } = this.getJoinInput()
    return `${this.chainId}:${this.slippage}${JSON.stringify(this.poolStateInput)}`
  }

  public setSlippage(slippagePercentage: HumanAmount) {
    this.slippage = Slippage.fromPercentage(slippagePercentage)
  }

  getAddLiquidityInputForSDK(humanAmountsIn: HumanAmountIn[]) {
    switch (this.addLiquidityType) {
      case 'unbalanced':
        return this.getUnbalancedAddLiquidityInput({ humanAmountsIn })
      default:
        return this.getUnbalancedAddLiquidityInput({ humanAmountsIn })
    }
  }

  getAddLiquidityInputBase() {
    return {
      chainId: this.chainId,
      rpcUrl: this.getDefaultRpcUrl(),
    }
  }

  getDefaultRpcUrl() {
    // console.log('default rpc url', getDefaultRpcUrl(this.chainId))
    return getDefaultRpcUrl(this.chainId)
  }

  getUnbalancedAddLiquidityInput({
    humanAmountsIn,
    useNativeAssetAsWrappedAmountIn = false,
  }: {
    humanAmountsIn: HumanAmountIn[]
    useNativeAssetAsWrappedAmountIn?: boolean
  }): AddLiquidityUnbalancedInput {
    const amountsInList: InputAmount[] = this.poolStateInput?.tokens.map(t => {
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
      ...this.getAddLiquidityInputBase(),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn,
    }
  }

  public async buildSdkAddLiquidityTxConfig(account: Address, humanAmountsIn: HumanAmountIn[]) {
    const addLiquidityInput = this.getAddLiquidityInputForSDK(humanAmountsIn)

    const addLiquidity = new AddLiquidity()
    // TODO: we probably don't need this query when building the call as we already used it (check queryAddLiquidity) during the Add Liquidity form management
    const queryResult = await addLiquidity.query(addLiquidityInput, this.poolStateInput)

    const { call, to, value, maxAmountsIn, minBptOut } = addLiquidity.buildCall({
      ...queryResult,
      slippage: this.slippage,
      sender: account,
      recipient: account,
    })

    const config: SdkTransactionConfig = {
      account,
      chainId: this.chainId,
      data: call,
      to,
      value,
    }

    return { maxAmountsIn, minBptOut, queryResult, config }
  }
}
