import { getNetworkConfig } from '@/lib/config/app.config'
import { SdkTransactionConfig } from '@/lib/modules/web3/contracts/contract.types'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { chains } from '@/lib/modules/web3/Web3Provider'
import { isSameAddress } from '@/lib/shared/utils/addresses'
import {
  ChainId,
  HumanAmount,
  JoinKind,
  PoolJoin,
  PoolStateInput,
  SingleAssetJoinInput,
  Slippage,
  Token,
  TokenAmount,
  UnbalancedJoinInput,
} from '@balancer/sdk'
import { Dictionary, keyBy } from 'lodash'
import { Address } from 'wagmi'

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
  amountsInByTokenAddress: Dictionary<TokenAmount> = {}

  constructor(
    private chainId: ChainId,
    private poolStateInput: PoolStateInput = NullPoolState,
    public joinType: JoinType = 'unbalanced'
  ) {
    const amountsInList = poolStateInput?.tokens
      .map(t => new Token(chainId, t.address, t.decimals))
      .map(t => TokenAmount.fromHumanAmount(t, '0'))

    this.amountsInByTokenAddress = keyBy(amountsInList, a => a.token.address)
  }

  get poolId() {
    return this.poolStateInput.id
  }

  getToken(tokenAddress: Address) {
    const token = this.poolStateInput.tokens.find(t => isSameAddress(t.address, tokenAddress))
    return token
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
    this.amountsInByTokenAddress[tokenAddress] = TokenAmount.fromHumanAmount(
      this.amountsInByTokenAddress[tokenAddress].token,
      humanAmount
    )
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

  getJoinInputBase() {
    return {
      chainId: this.chainId,
      rpcUrl: chains[0].rpcUrls.public.http[0], //TODO: create helper to get by current chain? or useNetwork() or similar wagmi hook?
    }
  }

  getUnbalancedJoinInput({ useNativeAssetAsWrappedAmountIn = false } = {}): UnbalancedJoinInput {
    return {
      ...this.getJoinInputBase(),
      //amountsIn: Object.values(this.amountsInByTokenAddress).filter(a => a.amount !== 0n),
      amountsIn: [],
      kind: JoinKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn,
    }
  }

  // WIP
  // getSingleAssetJoinInput(tokenIn: Address, humanAmount: HumanAmount): SingleAssetJoinInput {
  getSingleAssetJoinInput(): SingleAssetJoinInput {
    // setup BPT token
    const bptToken = new Token(this.chainId, this.poolStateInput.address, 18, 'BPT')
    const bptOut = TokenAmount.fromHumanAmount(bptToken, '1')
    const tokenIn = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' // WETH asset in eth

    // perform join query to get expected bpt out
    return {
      ...this.getJoinInputBase(),
      bptOut: {
        address: '0x0',
        decimals: 0,
        rawAmount: 0n,
      },
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
