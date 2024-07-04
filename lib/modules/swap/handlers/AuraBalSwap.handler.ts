import { getChainId } from '@/lib/config/app.config'
import { SwapHandler } from './Swap.handler'
import { GqlSorSwapType, GqlToken } from '@/lib/shared/services/api/generated/graphql'
import { AuraBalSwap, HumanAmount, Slippage, SwapKind, Token, TokenAmount } from '@balancer/sdk'
import { formatUnits } from 'viem'
import { TransactionConfig } from '../../web3/contracts/contract.types'
import {
  AuraBalBuildSwapInputs,
  AuraBalSimulateSwapResponse,
  SimulateSwapInputs,
} from '../swap.types'
import { getDefaultRpcUrl } from '@/lib/modules/web3/ChainConfig'
import { isSameAddress } from '@/lib/shared/utils/addresses'

export class AuraBalSwapHandler implements SwapHandler {
  constructor(public tokens: GqlToken[]) {}

  async simulate({ ...variables }: SimulateSwapInputs): Promise<AuraBalSimulateSwapResponse> {
    const { chain, swapType } = variables
    const rpcUrl = getDefaultRpcUrl(getChainId(chain))
    const _tokenIn = this.tokens.find(token => isSameAddress(token.address, variables.tokenIn))
    const _tokenOut = this.tokens.find(token => isSameAddress(token.address, variables.tokenOut))

    if (!_tokenIn || !_tokenOut) {
      throw new Error('Token not found')
    }

    const tokenIn = new Token(_tokenIn.chainId, variables.tokenIn, _tokenIn.decimals)
    const tokenOut = new Token(_tokenOut.chainId, variables.tokenOut, _tokenOut.decimals)
    const swapAmountToken = swapType === GqlSorSwapType.ExactIn ? tokenIn : tokenOut
    const swapAmount = TokenAmount.fromHumanAmount(
      swapAmountToken,
      variables.swapAmount as HumanAmount
    )
    const kind = this.swapTypeToKind(swapType)

    const auraBalSwap = new AuraBalSwap(rpcUrl)

    const isAuraBalSwap = auraBalSwap.isAuraBalSwap({
      tokenIn,
      tokenOut,
      swapAmount,
      kind,
    })

    if (!isAuraBalSwap) throw new Error('Invalid AuraBal swap')

    // Get accurate return amount with onchain call
    const queryOutput = await auraBalSwap.query({
      tokenIn,
      tokenOut,
      swapAmount,
      kind,
    })

    // Format return amount to human readable
    const returnAmount = formatUnits(
      queryOutput.expectedAmountOut.amount,
      queryOutput.expectedAmountOut.token.decimals
    )

    return {
      returnAmount,
      queryOutput,
      swapType,
      effectivePrice: '1', // TODO
      effectivePriceReversed: '1', // TODO
    }
  }

  build({
    simulateResponse: { queryOutput },
    slippagePercent,
    account,
    selectedChain,
  }: AuraBalBuildSwapInputs): TransactionConfig {
    const rpcUrl = getDefaultRpcUrl(getChainId(selectedChain))

    const auraBalSwap = new AuraBalSwap(rpcUrl)

    const tx = auraBalSwap.buildCall({
      slippage: Slippage.fromPercentage(slippagePercent as HumanAmount),
      user: account,
      wethIsEth: false,
      queryOutput,
    })

    return {
      account,
      chainId: getChainId(selectedChain),
      data: tx.callData,
      value: tx.value,
      to: tx.to,
    }
  }

  private swapTypeToKind(swapType: GqlSorSwapType): SwapKind {
    switch (swapType) {
      case GqlSorSwapType.ExactIn:
        return SwapKind.GivenIn
      case GqlSorSwapType.ExactOut:
        return SwapKind.GivenOut
      default:
        throw new Error('Invalid swap type')
    }
  }
}
