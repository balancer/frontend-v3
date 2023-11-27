import { getNetworkConfig } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { chains } from '@/lib/modules/web3/Web3Provider'
import { SdkTransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { TokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
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
import { Dictionary, keyBy } from 'lodash'
import { parseUnits } from 'viem'
import { Address } from 'wagmi'

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
  amountsInByTokenAddress: Dictionary<InputAmount> = {}

  constructor(
    private chainId: SupportedChainId,
    private tokenAllowances: TokenAllowances,
    private poolStateInput: PoolStateInput = NullPoolState,
    public addLiquidityType: AddLiquidityType = 'unbalanced'
  ) {
    const amountsInList: InputAmount[] = poolStateInput?.tokens.map(t => ({
      address: t.address,
      decimals: t.decimals,
      rawAmount: 0n,
    }))

    this.amountsInByTokenAddress = keyBy(amountsInList, a => a.address)
  }

  get poolId() {
    return this.poolStateInput.id
  }

  getToken(tokenAddress: Address) {
    const token = this.poolStateInput.tokens.find(t => isSameAddress(t.address, tokenAddress))
    return token
  }

  hasTokenAllowance() {
    // TODO: depending on the user input this rule will be different
    // Here we will check that the user has enough allowance for the current Join operation
    return Object.values(this.tokenAllowances).every(a => a > 0n)
  }

  public get queryKey() {
    // REVIEW THIS
    // const { amountsIn } = this.getJoinInput()
    return `${this.poolStateInput.id}:${this.chainId}:${this.slippage}${JSON.stringify(
      this.getAddLiquidityInputForSDK()
    )}`
  }

  public setSlippage(slippagePercentage: HumanAmount) {
    this.slippage = Slippage.fromPercentage(slippagePercentage)
  }

  public setAmountIn(tokenAddress: Address, humanAmount: HumanAmount): void {
    if (this.poolStateInput.tokens.length === 0) return
    this.amountsInByTokenAddress[tokenAddress].rawAmount = parseUnits(
      humanAmount,
      this.amountsInByTokenAddress[tokenAddress].decimals
    )
  }

  toRawAmount(tokenAddress: Address, humanAmount: HumanAmount) {
    const decimals = this.amountsInByTokenAddress[tokenAddress].decimals
    return parseUnits(humanAmount, decimals)
  }

  get nativeAssetToken() {
    return getNetworkConfig(this.chainId).tokens.nativeAsset
  }

  get nativeAssetAddress(): Address {
    return this.nativeAssetToken.address
  }

  getAddLiquidityInputForSDK() {
    if (this.addLiquidityType === 'unbalanced') return this.getUnbalancedAddLiquidityInput()
    if (this.addLiquidityType === 'unbalancedNativeAsset') {
      return this.getUnbalancedAddLiquidityInput({ useNativeAssetAsWrappedAmountIn: true })
    }
    if (this.addLiquidityType === 'singleToken') return this.getAddLiquiditySingleTokenInput()
    return this.getUnbalancedAddLiquidityInput()
  }

  getAddLiquidityInputBase() {
    return {
      chainId: this.chainId,
      rpcUrl: chains[0].rpcUrls.public.http[0], //TODO: create helper to get by current chain? or useNetwork() or similar wagmi hook?
    }
  }

  getUnbalancedAddLiquidityInput({
    useNativeAssetAsWrappedAmountIn = false,
  } = {}): AddLiquidityUnbalancedInput {
    return {
      ...this.getAddLiquidityInputBase(),
      amountsIn: Object.values(this.amountsInByTokenAddress),
      kind: AddLiquidityKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn,
    }
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

  public async buildSdkAddLiquidityTxConfig(account: Address) {
    const addLiquidityInput = this.getAddLiquidityInputForSDK()

    const addLiquidity = new AddLiquidity()
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

// Null object used to avoid conditional checks during hook loading state
const NullPoolState: PoolStateInput = {
  id: nullAddress,
  address: nullAddress,
  type: 'Null',
  tokens: [],
}
