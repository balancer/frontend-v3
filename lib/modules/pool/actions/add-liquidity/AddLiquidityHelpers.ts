import { getNetworkConfig } from '@/lib/config/app.config'
import { SupportedChainId } from '@/lib/config/config.types'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { PoolStateInput } from '@balancer/sdk'
import { Address } from 'wagmi'
import { HumanAmountInWithTokenInfo } from './AddLiquidityFlowButton'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { HumanAmountIn } from './add-liquidity.types'
import { parseUnits } from 'viem'
import { keyBy } from 'lodash'

// TODO: this should be imported from the SDK
export type InputAmount = {
  address: Address
  decimals: number
  rawAmount: bigint
}

// Null object used to avoid conditional checks during hook loading state
const NullPoolState: PoolStateInput = {
  id: nullAddress,
  address: nullAddress,
  type: 'Null',
  tokens: [],
}

/*
  AddLiquidityHelpers provides a set of helpers to explore the pool state
  Consumed by add liquidity handlers
*/
export class AddLiquidityHelpers {
  constructor(
    public readonly chainId: SupportedChainId,
    public poolStateInput: PoolStateInput = NullPoolState
  ) {}

  public get networkConfig() {
    return getNetworkConfig(this.chainId)
  }

  public get poolTokenAddresses(): Address[] {
    return this.poolStateInput.tokens.map(t => t.address)
  }

  //TODO: move to common place (abstract??)
  public getAmountsToApprove(
    humanAmountsInWithTokenInfo: HumanAmountInWithTokenInfo[]
  ): TokenAmountToApprove[] {
    // TODO: sdkAmountsIn could be cached or passed as prop when going to preview
    return this.toInputAmounts(humanAmountsInWithTokenInfo).map(({ address, rawAmount }, index) => {
      const humanAmountWithInfo = humanAmountsInWithTokenInfo[index]
      return {
        tokenAddress: address,
        humanAmount: humanAmountWithInfo.humanAmount || '0',
        rawAmount,
        tokenSymbol: humanAmountWithInfo.symbol,
      }
    })
  }

  public toInputAmounts(humanAmountsIn: HumanAmountIn[]): InputAmount[] {
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
}
