import { getNetworkConfig } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { getDefaultRpcUrl } from '@/lib/modules/web3/Web3Provider'
import { SdkTransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import {
  AddLiquidity,
  AddLiquidityKind,
  AddLiquiditySingleTokenInput,
  AddLiquidityUnbalancedInput,
  HumanAmount,
  PoolStateInput,
  Slippage,
  Token,
} from '@balancer/sdk'
import { keyBy } from 'lodash'
import { parseUnits } from 'viem'
import { Address } from 'wagmi'
import { HumanAmountIn } from './add-liquidity.types'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { areEmptyAmounts } from './add-liquidity.helpers'
import { HumanAmountInWithTokenInfo } from './AddLiquidityFlowButton'

// TODO: this should be imported from the SDK
export type InputAmount = {
  address: Address
  decimals: number
  rawAmount: bigint
}

type AddLiquidityType = 'unbalanced' | 'unbalancedNativeAsset' | 'singleToken'

/*
  Class to build AddLiquidity configs with balancer SDK
  Those configs are passed to useManagedSendTransaction hook to send the an AddLiquidity transaction

  Usage:
  - Create an instance of AddLiquidityConfigBuilder
  - Setup the AddLiquidity state with methods like this.setAmountsIn()
  - Generate the final AddLiquidity config with this.buildSdkAddLiquidityTxConfig()
*/
export class AddLiquidityConfigBuilder {
  inputAmount: InputAmount[] = []
  slippage: Slippage = Slippage.fromPercentage('1')
  checkNativeBalance = false

  constructor(
    private chainId: SupportedChainId,
    public poolStateInput: PoolStateInput = NullPoolState,
    public addLiquidityType: AddLiquidityType = 'unbalanced'
  ) {}

  get poolId() {
    return this.poolStateInput.id
  }

  getToken(tokenAddress: Address) {
    const token = this.poolStateInput.tokens.find(t => isSameAddress(t.address, tokenAddress))
    return token
  }

  get poolTokenAddresses(): Address[] {
    return this.poolStateInput.tokens.map(t => t.address)
  }

  public get queryKey() {
    // REVIEW THIS
    // const { amountsIn } = this.getJoinInput()
    return `${this.chainId}:${this.slippage}${JSON.stringify(this.poolStateInput)}`
  }

  public setSlippage(slippagePercentage: HumanAmount) {
    this.slippage = Slippage.fromPercentage(slippagePercentage)
  }

  get nativeAssetToken() {
    return getNetworkConfig(this.chainId).tokens.nativeAsset
  }

  get nativeAssetAddress(): Address {
    return this.nativeAssetToken.address
  }

  getAddLiquidityInputForSDK(humanAmountsIn: HumanAmountIn[]) {
    if (this.addLiquidityType === 'unbalanced') {
      return this.getUnbalancedAddLiquidityInput({ humanAmountsIn })
    }
    if (this.addLiquidityType === 'unbalancedNativeAsset') {
      return this.getUnbalancedAddLiquidityInput({
        humanAmountsIn,
        useNativeAssetAsWrappedAmountIn: true,
      })
    }
    if (this.addLiquidityType === 'singleToken') return this.getAddLiquiditySingleTokenInput()
    // Default
    return this.getUnbalancedAddLiquidityInput({ humanAmountsIn })
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
    const amountsIn = this.toSdkAmountsIn(humanAmountsIn)

    return {
      ...this.getAddLiquidityInputBase(),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn,
    }
  }

  toSdkAmountsIn(humanAmountsIn: HumanAmountIn[]): InputAmount[] {
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
    return amountsIn
  }

  // WIP
  // getAddLiquiditySingleTokenInput(tokenIn: Address, humanAmount: HumanAmount): AddLiquiditySingleTokenInput {
  getAddLiquiditySingleTokenInput(): AddLiquiditySingleTokenInput {
    // setup BPT token
    const bptToken = new Token(this.chainId, this.poolStateInput.address, 18, 'BPT')
    const bptOut: InputAmount = {
      address: bptToken.address,
      decimals: bptToken.decimals,
      rawAmount: parseUnits('1', bptToken.decimals),
    }
    const tokenIn = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH asset in eth

    // perform AddLiquidity query to get expected bpt out
    return {
      ...this.getAddLiquidityInputBase(),

      bptOut,
      tokenIn,
      kind: AddLiquidityKind.SingleToken,
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

  getAmountsToApprove(
    humanAmountsInWithTokenInfo: HumanAmountInWithTokenInfo[]
  ): TokenAmountToApprove[] {
    // TODO: sdkAmountsIn could be cached or passed as prop when going to preview
    return this.toSdkAmountsIn(humanAmountsInWithTokenInfo).map(({ address, rawAmount }, index) => {
      const humanAmountWithInfo = humanAmountsInWithTokenInfo[index]
      return {
        tokenAddress: address,
        humanAmount: humanAmountWithInfo.humanAmount || '0',
        rawAmount,
        tokenSymbol: humanAmountWithInfo.symbol,
      }
    })
  }

  canExecuteAddLiquidity(humanAmountsIn: HumanAmountIn[]) {
    // TODO: do we need to render reasons why the transaction cannot be performed?
    return !areEmptyAmounts(humanAmountsIn)
  }
}

// Null object used to avoid conditional checks during hook loading state
const NullPoolState: PoolStateInput = {
  id: nullAddress,
  address: nullAddress,
  type: 'Null',
  tokens: [],
}
