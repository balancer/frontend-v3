import { nullAddress } from '@/lib/contracts/wagmi-helpers'
import { chains } from '@/lib/modules/web3/Web3Provider'
import {
  ChainId,
  JoinKind,
  PoolJoin,
  PoolStateInput,
  Slippage,
  Token,
  TokenAmount,
  UnbalancedJoinInput,
} from '@balancer/sdk'
import { Dictionary, keyBy } from 'lodash'
import { Address } from 'wagmi'
import { SdkTransactionConfig } from '@/lib/contracts/contract.types'
export class JoinPayload {
  slippage: Slippage = Slippage.fromPercentage('1')
  checkNativeBalance = false
  amountsInByTokenAddress: Dictionary<TokenAmount> = {}

  constructor(private chainId: ChainId, private poolStateInput: PoolStateInput = NullPoolState) {
    const amountsInList = poolStateInput?.tokens
      .map(t => new Token(chainId, t.address, t.decimals))
      .map(t => TokenAmount.fromHumanAmount(t, '1'))

    this.amountsInByTokenAddress = keyBy(amountsInList, a => a.token.address)
  }

  public get queryKey() {
    const { amountsIn } = this.getJoinInput()
    return `${this.poolStateInput.id}:${this.chainId}:${this.slippage}${amountsIn}`
  }

  public setSlippage(slippagePercentage: `${number}`) {
    this.slippage = Slippage.fromPercentage(slippagePercentage)
  }

  public setAmountIn(tokenAddress: Address, humanAmount: `${number}`) {
    if (this.poolStateInput.tokens.length === 0) return
    this.amountsInByTokenAddress[tokenAddress] = TokenAmount.fromHumanAmount(
      this.amountsInByTokenAddress[tokenAddress].token,
      humanAmount
    )
  }

  getJoinInput(): UnbalancedJoinInput {
    return {
      amountsIn: Object.values(this.amountsInByTokenAddress),
      chainId: this.chainId,
      // rpcUrl: chains[0].rpcUrls.public.http[0], //TODO: create helper to get by current chain? or useNetwork() or similar wagmi hook?
      rpcUrl: 'http://127.0.0.1:8555/',
      kind: JoinKind.Unbalanced,
      useNativeAssetAsWrappedAmountIn: true,
    }
  }

  public async buildSdkJoinTxConfig(account: Address) {
    const joinInput = this.getJoinInput()

    const poolJoin = new PoolJoin()
    const queryResult = await poolJoin.query(joinInput, this.poolStateInput)

    console.log('NEW: joinInput', joinInput)

    // console.log('BUildCall:', this.slippage)

    const { call, to, value, maxAmountsIn, minBptOut } = poolJoin.buildCall({
      ...queryResult,
      slippage: this.slippage,
      sender: account,
      recipient: account,
    })

    // console.log('BUildCallNEW: account', account)
    // console.log('BUildCallNEW: maxAmountsIn', maxAmountsIn)
    // console.log('BUildCallNEw: minBptOut', minBptOut)

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
