import { getChainId, getNetworkConfig } from '@/lib/config/app.config'
import { TokenAmountToApprove } from '@/lib/modules/tokens/approvals/approval-rules'
import { nullAddress } from '@/lib/modules/web3/contracts/wagmi-helpers'
import { PoolStateInput } from '@balancer/sdk'
import { keyBy } from 'lodash'
import { parseUnits } from 'viem'
import { Address } from 'wagmi'
import { toPoolStateInput } from '../../pool.helpers'
import { Pool } from '../../usePool'
import { HumanAmountInWithTokenInfo } from './AddLiquidityFlowButton'
import { HumanAmountIn } from './add-liquidity.types'

// TODO: this should be imported from the SDK
export type InputAmount = {
  address: Address
  decimals: number
  rawAmount: bigint
}

// Null object used to avoid conditional checks during hook loading state
const NullPool: Pool = {
  id: nullAddress,
  address: nullAddress,
  type: 'Null',
  tokens: [],
} as unknown as Pool

/*
  AddLiquidityHelpers provides helper methods to traverse the pool state and prepare data structures needed by add liquidity handlers
  to implement the AddLiquidityHandler interface
*/
export class AddLiquidityHelpers {
  constructor(public pool: Pool = NullPool) {}

  public get poolStateInput(): PoolStateInput {
    return toPoolStateInput(this.pool)
  }

  public get networkConfig() {
    return getNetworkConfig(this.pool.chain)
  }

  public get chainId() {
    return getChainId(this.pool.chain)
  }

  public get poolTokenAddresses(): Address[] {
    return this.pool.tokens.map(t => t.address as Address)
  }

  public getAmountsToApprove(
    humanAmountsInWithTokenInfo: HumanAmountInWithTokenInfo[]
  ): TokenAmountToApprove[] {
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
    const amountsInList: InputAmount[] = this.pool.tokens.map(t => {
      return {
        rawAmount: 0n,
        decimals: t.decimals,
        address: t.address as Address,
      }
    })

    const amountsInByTokenAddress = keyBy(amountsInList, a => a.address)

    // from humanAmountsIn to SDK AmountsIn
    humanAmountsIn.forEach(({ tokenAddress, humanAmount }) => {
      if (!amountsInByTokenAddress[tokenAddress]) {
        throw new Error(
          `Provided token address ${tokenAddress} not found in pool tokens [${Object.keys(
            amountsInByTokenAddress
          ).join(' , \n')}]`
        )
      }
      const decimals = amountsInByTokenAddress[tokenAddress].decimals
      amountsInByTokenAddress[tokenAddress].rawAmount = parseUnits(humanAmount, decimals)
    })

    const amountsIn = Object.values(amountsInByTokenAddress)
    return amountsIn
  }
}
