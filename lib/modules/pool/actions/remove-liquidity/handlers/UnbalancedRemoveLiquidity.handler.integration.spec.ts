/* eslint-disable max-len */
import networkConfig from '@/lib/config/networks/mainnet'
import { wETHAddress, wjAuraAddress } from '@/lib/debug-helpers'
import { aWjAuraWethPoolElementMock } from '@/test/msw/builders/gqlPoolElement.builders'
import { defaultTestUserAccount } from '@/test/utils/wagmi'
import { HumanAmount } from '@balancer/sdk'
import { Address } from 'viem'
import { aPhantomStablePoolStateInputMock } from '../../../__mocks__/pool.builders'
import { Pool } from '../../../usePool'
import { selectRemoveLiquidityHandler } from './selectRemoveLiquidityHandler'
import { HumanAmountIn } from '../../liquidity-types'

function selectUnbalancedHandler() {
  //TODO: refactor mock builders to build poolStateInput and pool at the same time
  return selectRemoveLiquidityHandler(aWjAuraWethPoolElementMock())
}

describe('When removing unbalanced liquidity for a weighted pool', () => {
  test('queries bptIn', async () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const result = await handler.queryRemoveLiquidity({
      humanAmountsIn,
    })

    expect(result.bptIn.amount).toBeGreaterThan(390000000000000000000n)
  })

  test('builds Tx Config', async () => {
    const humanAmountsIn: HumanAmountIn[] = [
      { humanAmount: '1', tokenAddress: wETHAddress },
      { humanAmount: '1', tokenAddress: wjAuraAddress },
    ]

    const handler = selectUnbalancedHandler()

    const { sdkQueryOutput } = await handler.queryRemoveLiquidity({
      humanAmountsIn,
    })

    const inputs = {
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
    }
    const result = await handler.buildRemoveLiquidityTx({ inputs, sdkQueryOutput })

    expect(result.to).toBe(networkConfig.contracts.balancer.vaultV2)
    expect(result.data).toBeDefined()
  })
})

describe('When adding unbalanced liquidity for an stable pool', () => {
  test('calculates price impact', async () => {
    const pool = aPhantomStablePoolStateInputMock() as Pool // wstETH-rETH-sfrxETH

    const handler = selectRemoveLiquidityHandler(pool)

    // wstETH-rETH-sfrxETH has 3 tokens + BPT token:
    // we use 0, 10, 100, 1000 as amounts
    const humanAmountsIn: HumanAmountIn[] = pool.tokens.map((token, i) => {
      return {
        humanAmount: (10 ** i).toString() as HumanAmount,
        tokenAddress: token.address as Address,
      }
    })

    const { sdkQueryOutput } = await handler.queryRemoveLiquidity({
      humanAmountsIn,
    })

    const inputs = {
      humanAmountsIn,
      account: defaultTestUserAccount,
      slippagePercent: '0.2',
    }
    const result = await handler.buildRemoveLiquidityTx({ inputs, sdkQueryOutput })
    expect(result.account).toBe(defaultTestUserAccount)
  })
})
