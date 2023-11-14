import { getNetworkConfig } from '@/lib/config/app.config'
import { wETHAddress } from '@/lib/debug-helpers'
import { chains } from '@/lib/modules/web3/Web3Provider'
import { SdkTransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { TokenAllowances } from '@/lib/modules/web3/useTokenAllowances'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import {
  ChainId,
  HumanAmount,
  JoinKind,
  PoolJoin,
  PoolStateInput,
  SingleAssetJoinInput,
  Slippage,
  UnbalancedJoinInput,
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

type JoinType = 'unbalanced' | 'unbalancedNativeAsset' | 'singleAsset'

/*
  Class to build Join configs with balancer SDK
  Those configs are passed to useManagedSendTransaction hook to send the a Join transaction

  Usage:
  - Create an instance of JoinConfigBuilder
  - Setup the Join state with methods like this.setAmountsIn()
  - Generate the final join config with this.buildSdkJoinTxConfig()
*/
export class JoinConfigBuilder {
  slippage: Slippage = Slippage.fromPercentage('1')
  checkNativeBalance = false
  amountsInByTokenAddress: Dictionary<InputAmount> = {}

  constructor(
    private chainId: ChainId,
    private tokenAllowances: TokenAllowances,
    private poolStateInput: PoolStateInput = NullPoolState,
    public joinType: JoinType = 'unbalanced'
  ) {
    const initialTokenAmount = 0n
    const amountsInList: InputAmount[] = poolStateInput?.tokens.map(t => ({
      address: t.address,
      decimals: t.decimals,
      rawAmount: initialTokenAmount,
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
    if (this.joinType === 'unbalanced') {
      return Object.values(this.tokenAllowances).every(a => a > 0n)
    }
    if (this.joinType === 'unbalancedNativeAsset') {
      return this.tokenAllowances[wETHAddress] > 0n
    }
    return false
  }

  public get queryKey() {
    // REVIEW THIS
    // const { amountsIn } = this.getJoinInput()
    return `${this.poolStateInput.id}:${this.chainId}:${this.slippage}${JSON.stringify(
      this.getJoinInputForSDK()
    )}`
  }

  public setSlippage(slippagePercentage: HumanAmount) {
    this.slippage = Slippage.fromPercentage(slippagePercentage)
  }

  public setAmountIn(tokenAddress: Address, humanAmount: HumanAmount): void {
    if (this.poolStateInput.tokens.length === 0) return
    this.amountsInByTokenAddress[tokenAddress].rawAmount = this.toRawAmount(
      tokenAddress,
      humanAmount
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

  getJoinInputForSDK() {
    if (this.joinType === 'unbalanced') return this.getUnbalancedJoinInput()
    if (this.joinType === 'unbalancedNativeAsset') {
      return this.getUnbalancedJoinInput({ useNativeAssetAsWrappedAmountIn: true })
    }
    if (this.joinType === 'singleAsset') return this.getSingleAssetJoinInput()
    return this.getUnbalancedJoinInput()
  }

  private getJoinInputBase() {
    return {
      chainId: this.chainId,
      rpcUrl: chains[0].rpcUrls.public.http[0], //TODO: create helper to get by current chain? or useNetwork() or similar wagmi hook?
    }
  }

  getUnbalancedJoinInput({ useNativeAssetAsWrappedAmountIn = false } = {}): UnbalancedJoinInput {
    return {
      ...this.getJoinInputBase(),
      amountsIn: Object.values(this.amountsInByTokenAddress).filter(a => a.rawAmount !== 0n),
      kind: JoinKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn,
    }
  }

  // WIP
  // getSingleAssetJoinInput(tokenIn: Address, humanAmount: HumanAmount): SingleAssetJoinInput {
  getSingleAssetJoinInput(): SingleAssetJoinInput {
    // setup BPT token
    const tokenIn = wETHAddress
    const humanBtpOutAmount = '1'
    const btpOutDecimals = 18

    const bptOut: InputAmount = {
      rawAmount: parseUnits(humanBtpOutAmount, btpOutDecimals),
      decimals: btpOutDecimals,
      address: this.poolStateInput.address,
    }

    // perform join query to get expected bpt out
    return {
      ...this.getJoinInputBase(),
      bptOut,
      tokenIn,
      kind: JoinKind.SingleAsset,
    }
  }

  public async buildSdkJoinTxConfig(account: Address) {
    const joinInput = this.getJoinInputForSDK()

    const poolJoin = new PoolJoin()

    const queryResult = await poolJoin.query(joinInput, this.poolStateInput)

    const { call, to, value, maxAmountsIn, minBptOut } = poolJoin.buildCall({
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
